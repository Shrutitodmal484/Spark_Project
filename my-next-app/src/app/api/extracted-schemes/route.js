// route.js
import { google } from 'googleapis';

export async function GET() {
  try {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!clientEmail || !privateKey) {
      console.error('Missing Google credentials:', {
        clientEmail: !!clientEmail,
        privateKey: !!privateKey
      });
      return Response.json({ 
        error: 'Google credentials not found in environment variables',
        details: 'Please check GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY in your .env file'
      }, { status: 400 });
    }
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1o0mIcmi-IkxYz7LD8hawnBa8cdxpd11fiUhzXDd7Xx4';
    
    // First, check if the spreadsheet is accessible
    try {
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId,
        fields: 'spreadsheetId,properties.title'
      });
      console.log('Spreadsheet accessible:', spreadsheet.data.properties.title);
    } catch (sheetError) {
      console.error('Spreadsheet not accessible:', sheetError);
      return Response.json({ 
        error: 'Spreadsheet not accessible',
        details: sheetError.message
      }, { status: 400 });
    }
    
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Schemes!A1:L1',
    });
    
    // Handle empty sheet - return empty array instead of error
    if (!headerResponse.data.values || headerResponse.data.values.length === 0) {
      console.log('Sheet is empty - no headers found');
      return Response.json([]);
    }
    
    const headers = headerResponse.data.values[0];
    console.log('Headers found:', headers);
    
    // Get data rows
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Schemes!A2:L',
    });
    
    const rows = response.data.values || [];
    console.log(`Found ${rows.length} rows of data`);
    
    // Map rows to objects
    const schemes = rows.map((row, index) => {
      const scheme = {};
      headers.forEach((header, headerIndex) => {
        scheme[header] = row[headerIndex] || '';
      });
      
      // Add row number for debugging
      scheme._rowNumber = index + 2; // +2 because headers are in row 1
      
      return scheme;
    });
    
    console.log('Processed schemes:', schemes.length);
    
    return Response.json(schemes);
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return Response.json({ 
      error: 'Failed to fetch data from Google Sheets',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}