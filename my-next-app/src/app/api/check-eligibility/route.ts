import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

const CRITERIA_TO_DOCUMENT_MAP: Record<string, string[]> = {
  'income': ['income certificate', 'salary slip', 'bank statement'],
  'caste': ['caste certificate'],
  'religion': ['religion certificate'],
  'residence': ['residence proof', 'utility bill', 'rent agreement'],
  'age': ['birth certificate', 'age proof'],
  'identity': ['aadhaar card', 'voter id', 'passport', 'driving license'],
  'domicile': ['domicile certificate'],
  'disability': ['disability certificate'],
  'education': ['education certificate', 'degree certificate', 'mark sheet'],
  'employment': ['employment certificate', 'experience letter'],
  'property': ['property documents', 'land records', 'sale deed'],
  'bank': ['bank statement', 'passbook'],
  'ration': ['ration card'],
  'pension': ['pension documents'],
  'marital': ['marriage certificate'],
  'bpl': ['bpl certificate'],
  'ews': ['ews certificate']
};

const LANGUAGE_LABELS = {
  en: {
    eligible: "Eligible: ",
    yes: "Yes",
    no: "No",
    reasons: "Reasons:",
    missingCriteria: "Missing Criteria:",
    suggestedDocuments: "Suggested Documents:"
  },
  mr: {
    eligible: "पात्र: ",
    yes: "होय",
    no: "नाही",
    reasons: "कारणे:",
    missingCriteria: "गहाळ निकष:",
    suggestedDocuments: "सुचवलेले दस्तऐवज:"
  }
};

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      console.error('NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables');
      return NextResponse.json(
        { success: false, error: 'Server configuration error: API key not set' },
        { status: 500 }
      );
    }

    const { schemeEligibility, userData } = await request.json();
    
    if (!schemeEligibility || !userData) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const languageCookie = request.cookies.get('preferred_language')?.value || 'en';
    const language = languageCookie === 'mr' ? 'mr' : 'en';
    const labels = LANGUAGE_LABELS[language];

    const formattedUserData = `
User Profile:
- State: ${userData.profile.state || 'Not specified'}
- District: ${userData.profile.district || 'Not specified'}
- Village: ${userData.profile.village || 'Not specified'}
- Caste: ${userData.profile.caste || 'Not specified'}
- Religion: ${userData.profile.religion || 'Not specified'}
Extracted Document Data:
${Object.entries(userData.extractedData || {})
  .map(([key, value]) => `- ${key.replace(/_/g, ' ')}: ${value}`)
  .join('\n')}
    `.trim();

    const prompt = `
You are an expert in Indian government scheme eligibility assessment. Your task is to determine if a user is eligible for a government scheme based on the provided eligibility criteria and user data.
SCHEME ELIGIBILITY CRITERIA:
${schemeEligibility}
USER DATA:
${formattedUserData}
INSTRUCTIONS:
1. Analyze the user's eligibility based on the scheme criteria and user data.
2. Consider all relevant factors including:
   - State and district residency requirements
   - Caste and religion criteria
   - Income limits (if mentioned in extracted data)
   - Age requirements (if mentioned in extracted data)
   - Gender requirements (if mentioned in extracted data)
   - Any other specific eligibility conditions mentioned
3. Provide a clear eligibility determination with specific reasons.
4. If the user is not eligible, explain which criteria they fail to meet.
5. If the user is eligible, confirm they meet all requirements.
6. If the user is not eligible due to missing documents, specify which documents are missing.
7. Provide all content in ${language === 'mr' ? 'Marathi' : 'English'} language.
RESPONSE FORMAT:
Provide your response in the following JSON format:
{
  "eligible": true/false,
  "reasons": ["Detailed explanation point 1", "Detailed explanation point 2", ...],
  "missingCriteria": ["List any criteria not met by the user", ...],
  "suggestedDocuments": ["List of suggested documents to upload for better eligibility assessment", ...]
}
Ensure your response is valid JSON and contains only the specified fields.
    `.trim();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Gemini response:', text);
    
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Invalid response format from AI:', text);
      throw new Error('Invalid response format from AI');
    }
    
    let eligibilityData;
    try {
      eligibilityData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      console.log('Raw response:', text);
      throw new Error('Failed to parse AI response as JSON');
    }
    
    // Ensure all required fields exist and are properly typed
    if (typeof eligibilityData.eligible !== 'boolean') {
      console.error('Invalid eligible value:', eligibilityData.eligible);
      eligibilityData.eligible = false;
    }
    
    // Ensure reasons is always an array
    if (!Array.isArray(eligibilityData.reasons)) {
      eligibilityData.reasons = eligibilityData.reasons ? [String(eligibilityData.reasons)] : [];
    }
    
    // Ensure missingCriteria is always an array
    if (!Array.isArray(eligibilityData.missingCriteria)) {
      eligibilityData.missingCriteria = eligibilityData.missingCriteria ? [String(eligibilityData.missingCriteria)] : [];
    }
    
    // Ensure suggestedDocuments is always an array
    if (!Array.isArray(eligibilityData.suggestedDocuments)) {
      eligibilityData.suggestedDocuments = eligibilityData.suggestedDocuments ? [String(eligibilityData.suggestedDocuments)] : [];
    }
    
    // If suggestedDocuments is not provided, try to infer from missingCriteria
    if (eligibilityData.suggestedDocuments.length === 0 && eligibilityData.missingCriteria.length > 0) {
      const suggestedDocs = new Set<string>();
      
      eligibilityData.missingCriteria.forEach((criteria: string) => {
        const lowerCriteria = criteria.toLowerCase();
        
        Object.keys(CRITERIA_TO_DOCUMENT_MAP).forEach(keyword => {
          if (lowerCriteria.includes(keyword)) {
            CRITERIA_TO_DOCUMENT_MAP[keyword].forEach(doc => suggestedDocs.add(doc));
          }
        });
      });
      
      eligibilityData.suggestedDocuments = Array.from(suggestedDocs);
    }
    
    let resultText = `${labels.eligible}${eligibilityData.eligible ? labels.yes : labels.no}\n\n`;
    
    resultText += `${labels.reasons}\n`;
    eligibilityData.reasons.forEach((reason: string) => {
      resultText += `• ${reason}\n`;
    });
    
    if (!eligibilityData.eligible && eligibilityData.missingCriteria.length > 0) {
      resultText += `\n${labels.missingCriteria}\n`;
      eligibilityData.missingCriteria.forEach((criteria: string) => {
        resultText += `• ${criteria}\n`;
      });
    }
    
    if (!eligibilityData.eligible && eligibilityData.suggestedDocuments.length > 0) {
      resultText += `\n${labels.suggestedDocuments}\n`;
      eligibilityData.suggestedDocuments.forEach((doc: string) => {
        resultText += `• ${doc}\n`;
      });
    }
    
    return NextResponse.json({
      success: true,
      result: resultText,
      details: eligibilityData,
      language
    });
  } catch (error) {
    console.error('Error checking eligibility:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to check eligibility',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}