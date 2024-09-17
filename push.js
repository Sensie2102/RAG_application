import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { promisify } from 'util';


const credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf8')); 


const folderPath = './test';


const authenticate = async () => {
  const { client_email, private_key } = credentials;
  const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
  
  const auth = new google.auth.JWT(
    client_email,
    null,
    private_key,
    scopes
  );
  
  return auth;
};


const readJsonFiles = () => {
  const jsonFiles = fs.readdirSync(folderPath);
  return jsonFiles.map(file => { //map becasue we get back array of arrays
    const filePath = path.join(folderPath, file);
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    
    const taskTitle = jsonData['Task Title'] || '';
    const metric = jsonData['Metric Targeted'] || '';
    const predictedAction = jsonData['Predicted Action'] || '';
    const predictedIntent = jsonData['Predicted Intent'] || '';
    
   
    return [taskTitle, metric, predictedAction, predictedIntent];
  });
};

// Function to upload data to Google Sheets
const uploadToGoogleSheets = async (auth, data) => {
  const sheets = google.sheets({ version: 'v4', auth });

  const spreadsheetId = '1yYPgPTdAcT6WqiK5Njy5ndB4ic276Zhghy_Eynetwos'; // Replace with your spreadsheet ID
  const range = 'SheetOutput!A2'; // Starting cell for data (after headers)
  
  const request = {
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    resource: {
      values: data,// uses 2 d array not objects
    },
  };
  
  try {
    const response = await sheets.spreadsheets.values.update(request);
    console.log('Data uploaded successfully:', response.data);
  } catch (err) {
    console.error('Error uploading data:', err);
  }
};


const main = async () => {
  try {
    
    const auth = await authenticate();

    const jsonData = readJsonFiles();

   
    const dataWithHeaders = [
      ['Task Title', 'Metric Targeted', 'Predicted Action', 'Predicted Intent'],
      ...jsonData
    ];

    // Upload data to Google Sheets
    await uploadToGoogleSheets(auth, dataWithHeaders);
  } catch (error) {
    console.error('Error in main process:', error);
  }
};

// Start the process
main();
