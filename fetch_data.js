import fs from 'fs';
import path from 'path';

const filePath = path.resolve('data/actionsDatabase.json');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        // Parse the JSON data
        const jsonData = JSON.parse(data);
        console.log('Parsed JSON data:', jsonData);
    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
});

