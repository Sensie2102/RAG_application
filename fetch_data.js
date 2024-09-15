import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, 'data');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const filePath = path.resolve('actionsDatabase.json')

const data = fs.readFileSync(filePath, 'utf8');

let jsonData = null;

try {
    jsonData = JSON.parse(data);
} catch (err) {
    console.error('Error parsing JSON:', err);
}

jsonData.forEach((data,index) => {
    const filePath = path.join(outputDir, `json_file_${index + 1}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');

});

