const express = require("express");
const cors = require("cors");
const multer = require("multer");
const vision = require("@google-cloud/vision");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require("@supabase/supabase-js");
const pdfParse = require('pdf-parse');
const { fromPath } = require("pdf2pic");
const fs = require("fs");
const path = require("path");
const os = require("os");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
const port = process.env.PORT || 3001;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const visionClient = new vision.ImageAnnotatorClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get("/test", (req, res) => {
  res.status(200).json({ message: "Server is running correctly" });
});

app.post("/extract-text", upload.single("file"), async (req, res) => {
  try {
    console.log("=== Text Extraction Started ===");
    
    if (!req.file) {
      console.log("ERROR: No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    console.log(`File details: name=${req.file.originalname}, size=${req.file.size}, type=${req.file.mimetype}`);
    
    let fullText = "";
    
    if (req.file.mimetype === 'application/pdf') {
      console.log("Processing PDF file...");
      try {
        const data = await pdfParse(req.file.buffer);
        fullText = data.text;
        
        if (fullText.trim().length > 0) {
          console.log(`PDF text extraction successful: ${fullText.length} characters extracted`);
        } else {
          console.log("No text found in PDF, trying OCR...");
          
          const tempDir = os.tmpdir();
          const tempFilePath = path.join(tempDir, `${Date.now()}.pdf`);
          
          fs.writeFileSync(tempFilePath, req.file.buffer);
          
          const options = {
            density: 300,
            saveFilename: "page",
            savePath: tempDir,
            format: "jpg",
            width: 2000,
            height: 2000
          };
          
          const convert = fromPath(tempFilePath, options);
          const pdfInfo = await convert.getInfo();
          
          for (let i = 1; i <= pdfInfo.numpages; i++) {
            const imagePath = path.join(tempDir, `page_${i}.jpg`);
            
            await convert(i, { responseType: "image" });
            
            const imageBuffer = fs.readFileSync(imagePath);
            
            const [visionResult] = await visionClient.textDetection(imageBuffer);
            const detections = visionResult.textAnnotations;
            
            if (detections && detections.length > 0) {
              const pageText = detections[0].description;
              fullText += pageText + "\n\n";
            }
            
            fs.unlinkSync(imagePath);
          }
          
          fs.unlinkSync(tempFilePath);
          
          console.log(`OCR extraction successful: ${fullText.length} characters extracted`);
        }
      } catch (pdfError) {
        console.error("PDF processing error:", pdfError);
        return res.json({ 
          success: false,
          message: "Failed to process PDF",
          error: pdfError.message
        });
      }
    } else {
      console.log("Processing image file...");
      try {
        const [visionResult] = await visionClient.textDetection(req.file.buffer);
        const detections = visionResult.textAnnotations;
        
        if (!detections || detections.length === 0) {
          console.log("ERROR: No text detected in the image");
          return res.json({ 
            success: false,
            message: "No text detected in the image"
          });
        }
        
        fullText = detections[0].description;
        console.log(`Image text extraction successful: ${fullText.length} characters extracted`);
      } catch (visionError) {
        console.error("Vision API error:", visionError);
        return res.json({ 
          success: false,
          message: "Failed to extract text from image",
          error: visionError.message
        });
      }
    }
    
    console.log("Extracted text preview:", fullText.substring(0, 200) + (fullText.length > 200 ? "..." : ""));
    
    console.log("=== Text Extraction Completed ===");
    res.json({ 
      success: true,
      message: "Text extracted successfully",
      extractedText: fullText,
      textLength: fullText.length
    });
  } catch (error) {
    console.error("ERROR: Text extraction failed:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to extract text",
      details: error.message
    });
  }
});

app.post("/process-document", upload.single("file"), async (req, res) => {
  try {
    console.log("=== Document Processing Started ===");
    
    if (!req.file) {
      console.log("ERROR: No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const { userId, documentId, language = "en" } = req.body;
    console.log(`Processing for user: ${userId}, document: ${documentId}, language: ${language}`);
    console.log(`File details: name=${req.file.originalname}, size=${req.file.size}, type=${req.file.mimetype}`);
    
    let fullText = "";
    
    if (req.file.mimetype === 'application/pdf') {
      console.log("Step 1: Processing PDF file...");
      try {
        const data = await pdfParse(req.file.buffer);
        fullText = data.text;
        
        if (fullText.trim().length > 0) {
          console.log(`Step 1 Complete: PDF text extraction successful (${fullText.length} characters)`);
        } else {
          console.log("No text found in PDF, trying OCR...");
          
          const tempDir = os.tmpdir();
          const tempFilePath = path.join(tempDir, `${Date.now()}.pdf`);
          
          fs.writeFileSync(tempFilePath, req.file.buffer);
          
          const options = {
            density: 300,
            saveFilename: "page",
            savePath: tempDir,
            format: "jpg",
            width: 2000,
            height: 2000
          };
          
          const convert = fromPath(tempFilePath, options);
          const pdfInfo = await convert.getInfo();
          
          for (let i = 1; i <= pdfInfo.numpages; i++) {
            const imagePath = path.join(tempDir, `page_${i}.jpg`);
            
            await convert(i, { responseType: "image" });
            
            const imageBuffer = fs.readFileSync(imagePath);
            
            const [visionResult] = await visionClient.textDetection(imageBuffer);
            const detections = visionResult.textAnnotations;
            
            if (detections && detections.length > 0) {
              const pageText = detections[0].description;
              fullText += pageText + "\n\n";
            }
            
            fs.unlinkSync(imagePath);
          }
          
          fs.unlinkSync(tempFilePath);
          
          console.log(`Step 1 Complete: OCR extraction successful (${fullText.length} characters)`);
        }
      } catch (pdfError) {
        console.error("PDF processing error:", pdfError);
        return res.status(500).json({ 
          error: "Failed to process PDF",
          details: pdfError.message
        });
      }
    } else {
      console.log("Step 1: Processing image file with Vision API...");
      try {
        const [visionResult] = await visionClient.textDetection(req.file.buffer);
        const detections = visionResult.textAnnotations;
        
        if (!detections || detections.length === 0) {
          console.log("ERROR: No text detected in the image");
          return res.json({ extractedFields: [], message: "No text detected in image" });
        }
        
        fullText = detections[0].description;
        console.log(`Step 1 Complete: Image text extraction successful (${fullText.length} characters)`);
      } catch (visionError) {
        console.error("Vision API error:", visionError);
        return res.status(500).json({ 
          error: "Failed to extract text from image",
          details: visionError.message
        });
      }
    }
    
    console.log("Extracted text preview:", fullText.substring(0, 200) + (fullText.length > 200 ? "..." : ""));
    
    const systemInstruction = `You are an expert document analysis AI specializing in Indian government documents with extensive experience in extracting structured information from various official records. Your primary function is to accurately identify and extract specific data fields from documents while maintaining high precision. If the data is in a language other than English, you will translate it to English while preserving the original meaning and values.

DOCUMENT ANALYSIS PROTOCOL:
1. First, determine the document type (e.g., Aadhaar card, PAN card, voter ID, income certificate, caste certificate, domicile certificate, birth certificate, death certificate, ration card, driving license, passport, property tax receipt, land record, pension certificate, employment certificate, bank statement, etc.)
2. LANGUAGE PROCESSING: 
   - Identify the language of the document text
   - If the document is in any language other than English (including Marathi, Hindi, Tamil, Telugu, Kannada, Bengali, Gujarati, etc.), translate ALL extracted information to English while preserving the original meaning and values
   - Ensure all field names and values in the output are in English
3. Carefully scan the document content to locate and extract the following fields only if they are explicitly present:

PERSONAL IDENTIFICATION FIELDS:
- name: Full name of the individual as it appears in the document
- father_name: Father's full name
- mother_name: Mother's full name
- spouse_name: Spouse's full name
- dob: Date of birth in DD/MM/YYYY format (convert if in different format)
- gender: Gender (Male/Female/Other)
- aadhaar: 12-digit Aadhaar number formatted as XXXX XXXX XXXX
- pan: 10-character alphanumeric PAN in uppercase
- voter_id: Voter identification number
- driving_license: Driving license number
- passport: Passport number
- ration_card: Ration card number and type (APL/BPL)

CONTACT INFORMATION:
- address: Complete residential address including state, district, pincode
- phone: 10-digit mobile number without country code or spaces
- email: Complete email address

DEMOGRAPHIC INFORMATION:
- nationality: Nationality (typically Indian for government documents)
- religion: Religion mentioned in the document
- caste: Caste or social category
- domicile: State or region of domicile
- marital_status: Marital status (Single/Married/Divorced/Widowed)

FINANCIAL INFORMATION:
- income: ANNUAL INCOME INFORMATION - This is critical:
   * If the document shows income for multiple years, create an array of objects with "year" and "amount" properties
   * For example: [{"year":"2021-2022","amount":"₹42,000"}, {"year":"2020-2021","amount":"₹40,000"}]
   * If only one year's income is shown, still use the same format: [{"year":"2019-2020","amount":"₹40,000"}]
   * Always preserve the currency symbol and exact amount as shown in the document
   * The year should be in the format shown in the document (e.g., "2021-2022", "2020-21", etc.)
- bank: Bank name, account number, IFSC code
- occupation: Profession or occupation
- pension_details: Pension-related information if applicable

EDUCATION AND PROPERTY:
- education: Highest educational qualification
- property_details: Property description, survey number, area
- land_details: Landholding details, survey numbers, area measurements

DOCUMENT METADATA:
- certificate_number: Unique certificate or document number
- date_of_issue: Date of issuance in DD/MM/YYYY format
- date_of_expiry: Expiry date if applicable
- issuing_authority: Authority that issued the document

DATA EXTRACTION RULES:
1. Extract only information that is explicitly stated in the document
2. Do not infer, guess, or fabricate any information
3. For dates, always use DD/MM/YYYY format
4. For phone numbers, provide exactly 10 digits without formatting
5. For Aadhaar, use XXXX XXXX XXXX format
6. For monetary values, preserve the currency symbol
7. If multiple values exist for a field (e.g., multiple addresses, phone numbers), return them as an array
8. If a field is not present in the document, omit it from the output
9. TRANSLATE ALL VALUES TO ENGLISH IF THE ORIGINAL DOCUMENT IS IN ANOTHER LANGUAGE

OUTPUT FORMAT:
Return a valid JSON object containing only the fields that were found in the document. Do not include fields that were not present. Ensure all text values are in English, with original numeric values preserved.`;
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction,
    });
    
    console.log("Step 2: Extracting fields with Gemini AI...");
    const genResult = await model.generateContent(fullText);
    const response = await genResult.response;
    const text = response.text();
    console.log("Step 2 Complete: Gemini response received");
    console.log("Gemini raw response:", text);
    
    let extractedData;
    try {
      const cleanText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      console.log("Cleaned text for parsing:", cleanText);
      extractedData = JSON.parse(cleanText);
      console.log("Step 3 Complete: Successfully parsed JSON");
      console.log("Extracted data:", JSON.stringify(extractedData, null, 2));
    } catch (parseError) {
      console.error("ERROR: Failed to parse JSON response:", parseError);
      console.error("Raw response that failed to parse:", text);
      return res.status(500).json({ 
        error: "Failed to parse extracted data", 
        rawResponse: text,
        parseError: parseError.message 
      });
    }
    
    // Get document information
   // Get document information
const { data: documentInfo, error: docError } = await supabase
  .from('documents')
  .select('name, category, created_at')
  .eq('id', documentId);

if (docError || !documentInfo || documentInfo.length === 0) {
  console.error("Error fetching document info or document not found:", docError);
  // Create a default document info object instead of returning an error
  const documentInfo = [{
    name: req.file.originalname,
    category: "unknown",
    created_at: new Date().toISOString()
  }];
}

// Use the first document from the results
const document = documentInfo[0];
    
    // Prepare extracted fields without breaking arrays
    const extractedFields = [];
    for (const [key, value] of Object.entries(extractedData)) {
      if (value !== null && value !== undefined && value !== "") {
        extractedFields.push({
          field_type: key,
          field_value: typeof value === "object" ? JSON.stringify(value) : String(value)
        });
      }
    }
    
    console.log(`Step 4 Complete: Prepared ${extractedFields.length} fields for database`);
    
    // Get existing fields for this user to avoid duplicates
    const { data: existingFields, error: fetchError } = await supabase
      .from('extracted_document_data')
      .select('field_type, documents!inner(name, created_at)')
      .eq('user_id', userId);
    
    if (fetchError) {
      console.error("Error fetching existing fields:", fetchError);
    }
    
    // Group existing fields by type
    const existingFieldsByType = {};
    if (existingFields) {
      for (const field of existingFields) {
        if (!existingFieldsByType[field.field_type]) {
          existingFieldsByType[field.field_type] = [];
        }
        existingFieldsByType[field.field_type].push(field);
      }
    }
    
    // Process each field type
    const fieldsToInsert = [];
    const fieldsToDelete = [];
    
    for (const field of extractedFields) {
      const fieldType = field.field_type;
      
      if (existingFieldsByType[fieldType] && existingFieldsByType[fieldType].length > 0) {
        // Find the most recent document for this field type
        const mostRecentField = existingFieldsByType[fieldType]
          .sort((a, b) => new Date(b.documents.created_at).getTime() - new Date(a.documents.created_at).getTime())[0];
        
const mostRecentDate = new Date(mostRecentField.documents.created_at);
const currentDate = new Date(document.created_at);
        
        if (currentDate > mostRecentDate) {
          // Current document is more recent, so delete all existing fields of this type
          for (const existingField of existingFieldsByType[fieldType]) {
            fieldsToDelete.push(existingField.id);
          }
          // Add current field
          fieldsToInsert.push({
            user_id: userId,
            document_id: documentId,
            field_type: fieldType,
            field_value: field.field_value
          });
        }
        // Else, skip this field (keep the existing one)
      } else {
        // No existing field of this type, so add it
        fieldsToInsert.push({
          user_id: userId,
          document_id: documentId,
          field_type: fieldType,
          field_value: field.field_value
        });
      }
    }
    
    // Delete outdated fields
    if (fieldsToDelete.length > 0) {
      console.log(`Deleting ${fieldsToDelete.length} outdated fields...`);
      const { error: deleteError } = await supabase
        .from('extracted_document_data')
        .delete()
        .in('id', fieldsToDelete);
      
      if (deleteError) {
        console.error("Error deleting outdated fields:", deleteError);
      }
    }
    
    // Insert new fields
    if (fieldsToInsert.length > 0) {
      console.log(`Step 5: Saving ${fieldsToInsert.length} fields to database...`);
      const { error: insertError } = await supabase
        .from('extracted_document_data')
        .insert(fieldsToInsert);
      
      if (insertError) {
        console.error("Error inserting fields:", insertError);
      } else {
        console.log("Step 5 Complete: All fields saved to database");
      }
    } else {
      console.log("No new fields to save to database");
    }
    
    console.log("=== Document Processing Completed Successfully ===");
    res.json({ extractedFields: fieldsToInsert });
  } catch (error) {
    console.error("ERROR: Document processing failed:", error);
    res.status(500).json({ 
      error: "Failed to process document",
      details: error.message,
      stack: error.stack 
    });
  }
});

app.listen(port, () => {
  console.log(`Document processing server running at http://localhost:${port}`);
});