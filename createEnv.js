const fs = require('fs');
const path = require('path');

console.log(__dirname)
const FILE_ENV = path.resolve(__dirname, "node.env");

let writeFile = fs.createWriteStream(FILE_ENV);

writeFile.on('finish', () => console.log(`File ${path.basename(FILE_ENV)} has been written`));

const data = {
    name: "Nikita",
    age: 20,
    pdf_profile: "/prof/file.pdf",
    living: "Sumy",
    file_pdf: "./pharmacy.pdf"
}

for (const i in data) {
    writeFile.write(`${i}=${data[i]}\n`)
}

writeFile.end();


// let readFile = fs.createReadStream(FILE_ENV);

// readFile.on('data', data => {
//     console.log(`Reading ${data.toString('utf8')}`);
// });