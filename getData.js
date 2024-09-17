import xlsx from 'xlsx';
import fs from 'fs'

const filePath = "C:/Users/mafaa/Downloads/TCs.xlsx";


const workbook = xlsx.readFile(filePath);

const sheetName = workbook.SheetNames[0];


const sheet = workbook.Sheets[sheetName];

const data = xlsx.utils.sheet_to_json(sheet);

data.map(item => {
    delete item['Created Date']
    delete item['Task Name']
})



data.forEach((element,index) => {
    const filename = `test/json_file_${index + 1}.json`;
    fs.writeFile(filename, JSON.stringify(element, null, 4), 'utf8', (err) => {
        if (err) {
          console.error(`Error writing file ${filename}:`, err);
        } else {
          console.log(`Successfully wrote ${filename}`);
        }
    })
    
});


