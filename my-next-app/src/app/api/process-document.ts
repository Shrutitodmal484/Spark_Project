
import type { NextApiRequest, NextApiResponse } from 'next';

import { GoogleGenerativeAI } from '@google/generative-ai';

import vision from '@google-cloud/vision';

import { supabase } from '@/lib/supabase';

import formidable from 'formidable';

import fs from 'fs';




const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');




const visionClient = new vision.ImageAnnotatorClient();




export const config = {

  api: {

    bodyParser: false,

  },

};



interface ExtractedField {

  field_type: string;

  field_value: string;

  confidence_score: number;

}




const detectDocumentLanguage = (text: string): 'eng' | 'mar' => {

  
  const marathiRegex = /[\u0900-\u097F]/;

  

  if (marathiRegex.test(text)) {

    console.log('🔍 Detected Marathi language in document');

    return 'mar';

  }

  

  console.log('🔍 Detected English language in document');

  return 'eng';

};




const cleanPhoneNumbers = (phoneValue: any): string => {

  if (typeof phoneValue === 'string') {

    
    if (/^\d{10}$/.test(phoneValue)) {

      return phoneValue;

    }

    
    const numbers = phoneValue.split(/[;\s,]+/);

    const validNumbers = numbers.filter(num => /^\d{10}$/.test(num));

    return validNumbers.join('; ');

  } else if (Array.isArray(phoneValue)) {

    const validNumbers = phoneValue

      .filter(item => typeof item === 'string' && /^\d{10}$/.test(item))

      .join('; ');

    return validNumbers;

  }

  return String(phoneValue);

};




const formatIncome = (incomeValue: any): string => {

  if (typeof incomeValue === 'string') {

    return incomeValue;

  } else if (Array.isArray(incomeValue)) {

    
    if (incomeValue.every(item => typeof item === 'object' && item !== null && 'value' in item)) {

      return incomeValue.map(item => {

        if ('year' in item) {

          return `${item.year}: ${item.value}`;

        }

        return item.value;

      }).join('; ');

    }

    
    return incomeValue.join('; ');

  } else if (typeof incomeValue === 'object' && incomeValue !== null) {

    if ('year' in incomeValue && 'value' in incomeValue) {

      return `${incomeValue.year}: ${incomeValue.value}`;

    }

    return JSON.stringify(incomeValue);

  }

  return String(incomeValue);

};




const formatDate = (dateValue: any): string => {

  if (typeof dateValue === 'string') {

    
    const dateMatch = dateValue.match(/(\d{2})\/(\d{2})\/(\d{4})/);

    if (dateMatch) {

      return dateMatch[0]; 
    }

    

    
    
    const isoMatch = dateValue.match(/(\d{4})-(\d{2})-(\d{2})/);

    if (isoMatch) {

      return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;

    }

    

    
    return dateValue;

  }

  return String(dateValue);

};




const extractStructuredDataWithGemini = async (text: string, language: 'eng' | 'mar'): Promise<ExtractedField[]> => {

  try {

    console.log('🤖 Starting Gemini structured data extraction');

    console.log('📝 Input text length:', text.length);

    console.log('📝 Document language:', language);

    console.log('📝 Input text preview:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));

    

    if (!process.env.GEMINI_API_KEY) {

      console.error('❌ Gemini API key is not configured');

      return [];

    }

    

    
    const systemInstruction = language === 'mar' 

      ? `You are an expert in analyzing and extracting structured data from all types of government-issued documents in India, including but not limited to income certificates, caste certificates, domicile certificates, nationality certificates, birth certificates, death certificates, ration cards, voter IDs, driving licenses, PAN cards, property tax receipts, land records, pension certificates, and employment certificates.

The document text provided is in Marathi. Your task is to extract only the meaningful and clearly available fields from the provided text and translate them to English.  

Do not guess or fabricate information.  

If a field is not explicitly present, omit it.  

If multiple values exist for a field (such as income for multiple years, multiple addresses, or more than one phone number), return them all in an array along with any available labels (like year or type).  



IMPORTANT: Pay special attention to the following:

1. For income values, extract the exact numeric value as it appears in the document. Do not alter or estimate the value.

2. For dates, ensure they are in DD/MM/YYYY format. If the date is in a different format, convert it to DD/MM/YYYY.

3. For phone numbers, ensure they are exactly 10 digits without country code, spaces, or other characters.



Keep formats consistent wherever possible:  

- Date: DD/MM/YYYY  

- Aadhaar: XXXX XXXX XXXX  

- Phone: Contact number(s) - exactly 10 digits without country code, spaces, or other characters. If multiple phone numbers are present, return each as a separate string in an array.

- Currency: Preserve currency symbol if present  

- PAN: 10-character alphanumeric in uppercase  

- Voter ID: As given in document  

- Ration Card No.: As given in document  

Fields to extract:  

- name: Full name of the person  

- father_name: Father's full name  

- mother_name: Mother's full name  

- spouse_name: Spouse's full name  

- aadhaar: Aadhaar number  

- pan: Permanent Account Number  

- voter_id: Voter ID number  

- ration_card: Ration card number or type  

- income: Annual income (single or multiple years). If year is available, return as an array of objects with 'year' and 'value'. If year is not available, return as a string or an array of strings.

- caste: Caste or category  

- religion: Religion mentioned  

- dob: Date of birth  

- date_of_issue: Date of issue of the document. If the document type is known, include it in the value (e.g., 'PAN: 15/03/2020').

- date_of_expiry: Date of expiry, if applicable  

- address: Residential or correspondence address  

- phone: Contact number(s) - exactly 10 digits without country code, spaces, or other characters. If multiple phone numbers are present, return each as a separate string in an array.

- email: Email address(es)  

- nationality: Declared nationality  

- domicile: State or region of domicile  

- gender: Gender mentioned  

- marital_status: Marital status  

- occupation: Occupation or profession  

- education: Education qualification(s)  

- property_details: Property description(s) if available  

- land_details: Landholding description(s) if available  

- pension_details: Pension-related information if available  

- certificate_number: Any unique document or certificate number

Output format:  

Return the result as a valid JSON object, containing only the fields that are found.  

If a field has multiple values, represent it as an array.  

All output must be in English, even if the input is in Marathi.`

      : `You are an expert in analyzing and extracting structured data from all types of government-issued documents in India, including but not limited to income certificates, caste certificates, domicile certificates, nationality certificates, birth certificates, death certificates, ration cards, voter IDs, driving licenses, PAN cards, property tax receipts, land records, pension certificates, and employment certificates.

Your task is to extract only the meaningful and clearly available fields from the provided text.  

Do not guess or fabricate information.  

If a field is not explicitly present, omit it.  

If multiple values exist for a field (such as income for multiple years, multiple addresses, or more than one phone number), return them all in an array along with any available labels (like year or type).  



IMPORTANT: Pay special attention to the following:

1. For income values, extract the exact numeric value as it appears in the document. Do not alter or estimate the value.

2. For dates, ensure they are in DD/MM/YYYY format. If the date is in a different format, convert it to DD/MM/YYYY.

3. For phone numbers, ensure they are exactly 10 digits without country code, spaces, or other characters.



Keep formats consistent wherever possible:  

- Date: DD/MM/YYYY  

- Aadhaar: XXXX XXXX XXXX  

- Phone: Contact number(s) - exactly 10 digits without country code, spaces, or other characters. If multiple phone numbers are present, return each as a separate string in an array.

- Currency: Preserve currency symbol if present  

- PAN: 10-character alphanumeric in uppercase  

- Voter ID: As given in document  

- Ration Card No.: As given in document  

Fields to extract:  

- name: Full name of the person  

- father_name: Father's full name  

- mother_name: Mother's full name  

- spouse_name: Spouse's full name  

- aadhaar: Aadhaar number  

- pan: Permanent Account Number  

- voter_id: Voter ID number  

- ration_card: Ration card number or type  

- income: Annual income (single or multiple years). If year is available, return as an array of objects with 'year' and 'value'. If year is not available, return as a string or an array of strings.

- caste: Caste or category  

- religion: Religion mentioned  

- dob: Date of birth  

- date_of_issue: Date of issue of the document. If the document type is known, include it in the value (e.g., 'PAN: 15/03/2020').

- date_of_expiry: Date of expiry, if applicable  

- address: Residential or correspondence address  

- phone: Contact number(s) - exactly 10 digits without country code, spaces, or other characters. If multiple phone numbers are present, return each as a separate string in an array.

- email: Email address(es)  

- nationality: Declared nationality  

- domicile: State or region of domicile  

- gender: Gender mentioned  

- marital_status: Marital status  

- occupation: Occupation or profession  

- education: Education qualification(s)  

- property_details: Property description(s) if available  

- land_details: Landholding description(s) if available  

- pension_details: Pension-related information if available  

- certificate_number: Any unique document or certificate number

Output format:  

Return the result as a valid JSON object, containing only the fields that are found.  

If a field has multiple values, represent it as an array.`;

    

    const model = genAI.getGenerativeModel({ 

      model: "gemini-1.5-flash",

      systemInstruction

    });

    

    
    const prompt = `Document text:\n${text}`;

    console.log('📤 Sending request to Gemini API...');

    

    const result = await model.generateContent(prompt);

    const response = await result.response;

    const responseText = response.text();

    

    console.log('📥 Gemini raw response:', responseText);

    

    
    let jsonText = responseText.trim();

    

    
    if (jsonText.startsWith('```json')) {

      jsonText = jsonText.substring(7);

    }

    if (jsonText.endsWith('```')) {

      jsonText = jsonText.substring(0, jsonText.length - 3);

    }

    

    console.log('🔧 Cleaned JSON text:', jsonText);

    

    
    let extractedData;

    try {

      extractedData = JSON.parse(jsonText);

      console.log('✅ Successfully parsed JSON:', extractedData);

    } catch (parseError) {

      console.error('❌ Failed to parse Gemini response as JSON:', parseError);

      console.error('❌ Attempted to parse:', jsonText);

      return [];

    }

    

    
    const fields: ExtractedField[] = [];

    

    
    const processFieldValue = (key: string, value: any): string => {

      if (key === 'phone') {

        return cleanPhoneNumbers(value);

      } else if (key === 'income') {

        return formatIncome(value);

      } else if (key === 'dob' || key === 'date_of_issue' || key === 'date_of_expiry') {

        return formatDate(value);

      } else if (typeof value === 'string') {

        return value.trim();

      } else if (Array.isArray(value)) {

        
        if (value.every(item => typeof item === 'string')) {

          return value.join('; ');

        }

        
        return value.map(item => JSON.stringify(item)).join('; ');

      } else if (typeof value === 'object' && value !== null) {

        return JSON.stringify(value);

      }

      return String(value).trim();

    };

    

    
    const calculateConfidence = (key: string, value: any): number => {

      let confidence = 0.9; 
      

      
      switch (key) {

        case 'aadhaar':

          confidence = typeof value === 'string' && /^\d{4}\s\d{4}\s\d{4}$/.test(value) ? 0.98 : 0.85;

          break;

        case 'pan':

          confidence = typeof value === 'string' && /^[A-Z]{5}\d{4}[A-Z]{1}$/.test(value) ? 0.98 : 0.85;

          break;

        case 'phone':

          if (Array.isArray(value)) {

            const allValid = value.every(item => typeof item === 'string' && /^\d{10}$/.test(item));

            confidence = allValid ? 0.95 : 0.8;

          } else if (typeof value === 'string') {

            confidence = /^\d{10}$/.test(value) ? 0.95 : 0.8;

          }

          break;

        case 'email':

          if (Array.isArray(value)) {

            const allValid = value.every(item => typeof item === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item));

            confidence = allValid ? 0.95 : 0.8;

          } else if (typeof value === 'string') {

            confidence = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 0.95 : 0.8;

          }

          break;

        case 'dob':

        case 'date_of_issue':

        case 'date_of_expiry':

          confidence = typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value) ? 0.95 : 0.8;

          break;

        case 'income':

          confidence = 0.85; 
          
          if (language === 'mar') {

            confidence = Math.max(0.7, confidence - 0.1);

          }

          break;

        case 'address':

          confidence = 0.85; 
          break;

        default:

          confidence = 0.9; 
      }

      

      
      if (language === 'mar') {

        confidence = Math.max(0.7, confidence - 0.05);

      }

      

      return confidence;

    };

    

    
    Object.entries(extractedData).forEach(([key, value]) => {

      if (value !== null && value !== undefined && value !== '') {

        const processedValue = processFieldValue(key, value);

        const confidence = calculateConfidence(key, value);

        

        fields.push({

          field_type: key,

          field_value: processedValue,

          confidence_score: confidence

        });

        

        console.log(`✅ Extracted field: ${key} = ${processedValue} (confidence: ${confidence})`);

      }

    });

    

    console.log('📊 Total extracted fields:', fields.length);

    return fields;

  } catch (error) {

    console.error('❌ Error extracting structured data with Gemini:', error);

    return [];

  }

};




const processDocumentAndExtractData = async (

  filePath: string, 

  userId: string, 

  documentId: string

): Promise<ExtractedField[]> => {

  try {

    console.log('🚀 Starting document processing:', { 

      filePath, 

      userId, 

      documentId 

    });

    

    
    console.log('🔍 Step 1: Extracting text from file...');

    

    
    const fileContent = fs.readFileSync(filePath);

    

    
    const request = {

      image: {

        content: fileContent,

      },

      features: [

        { type: 'TEXT_DETECTION' },

      ],

      imageContext: {

        languageHints: ['en', 'mr'], 
      },

    };

    

    console.log('📤 Sending request to Google Vision API...');

    

    
    const [result] = await visionClient.annotateImage(request);

    const detections = result.textAnnotations;

    

    if (!detections || detections.length === 0) {

      console.warn('⚠️ No text detected in the document');

      return [];

    }

    

    
    const extractedText = detections[0].description || '';

    

    console.log('📝 Extracted text length:', extractedText.length);

    console.log('📝 Extracted text preview:', extractedText.substring(0, 200) + (extractedText.length > 200 ? '...' : ''));

    

    
    const detectedLanguage = detectDocumentLanguage(extractedText);

    

    if (!extractedText || extractedText.trim().length === 0) {

      console.warn('⚠️ No text extracted from file');

      return [];

    }

    

    
    console.log('🤖 Step 2: Extracting structured data with Gemini...');

    const extractedFields = await extractStructuredDataWithGemini(extractedText, detectedLanguage);

    

    
    if (extractedFields.length > 0) {

      console.log('💾 Step 3: Saving extracted fields to database...');

      console.log('📊 Fields to save:', extractedFields);

      

      const { data, error } = await supabase

        .from('extracted_document_data')

        .insert(

          extractedFields.map(field => ({

            user_id: userId,

            document_id: documentId,

            field_type: field.field_type,

            field_value: field.field_value,

            confidence_score: field.confidence_score,

          }))

        );

      

      if (error) {

        console.error('❌ Error saving extracted data to database:', error);

        console.error('❌ Error details:', {

          code: error.code,

          message: error.message,

          details: error.details,

          hint: error.hint

        });

      } else {

        console.log('✅ Extracted data saved successfully to database:', data);

      }

    } else {

      console.log('⚠️ No fields extracted from the document, nothing to save');

    }

    

    console.log('🏁 Document processing completed');

    return extractedFields;

  } catch (error) {

    console.error('❌ Error processing document:', error);

    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    return [];

  }

};



export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') {

    return res.status(405).json({ error: 'Method not allowed' });

  }



  try {

    
    const form = formidable({ multiples: false });

    

    const data = await new Promise<{ fields: any; files: any }>((resolve, reject) => {

      form.parse(req, (err, fields, files) => {

        if (err) reject(err);

        resolve({ fields, files });

      });

    });



    const { userId, documentId } = data.fields;

    const file = data.files.file;



    if (!userId || !documentId || !file) {

      return res.status(400).json({ error: 'Missing required fields' });

    }



    
    const filePath = file.filepath;



    
    const extractedFields = await processDocumentAndExtractData(filePath, userId, documentId);



    
    fs.unlinkSync(filePath);



    
    res.status(200).json({ extractedFields });

  } catch (error) {

    console.error('❌ Error in API route:', error);

    res.status(500).json({ error: 'Internal server error' });

  }

}
