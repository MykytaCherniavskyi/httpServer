const http = require('http');
const fs = require('fs');
const path = require('path');

const FILE_ENV = path.resolve(__dirname, "node.env");
const PORT = 3000;

const server = http.createServer((request, response) => {
    const { remoteAddress, remotePort } = response.socket;
    let parsebleUrl = request.url.split('/');
    const FILE_LOGS = path.resolve(__dirname, "logs.txt");

    let writeFile = fs.createWriteStream(FILE_LOGS, {
        flags: 'a'
    });

    writeFile.on('finish', () => console.log(`File ${path.basename(FILE_LOGS)} has been written`));

    writeFile.write(`${new Date().toLocaleString()} - ${request.method} - ${request.url} - ${request.rawHeaders}\n`)

    writeFile.end();

    switch(request.url) {
        case '/variables':
            console.log(`Requested ${request.method} ${request.url} from ${remoteAddress}:${remotePort}`);

            let readFile = fs.createReadStream(FILE_ENV);
            let dataFolder;
            let dataArr = [];

            readFile.on('data', data => {
                let dataKey;
                dataFolder = data.toString('utf8');

                let splitebleArr = dataFolder.split('\n');
                splitebleArr.forEach(i => {

                    [dataKey] = i.split('=');
                    dataArr.push(dataKey);
                });
                response.setHeader('Content-Type', 'application/json');
                response.statusCode = 201;
                response.end(JSON.stringify(dataArr));
            });
            break;
        case `/variables/${parsebleUrl[2]}`:
            console.log(`Requested ${request.method} ${request.url} from ${remoteAddress}:${remotePort}`);

            let readFile2 = fs.createReadStream(FILE_ENV);
            let currentLine = '';
            let dataFileArr = [];

            readFile2.on('data', data => {
                let dataKey;
                dataFileArr = data.toString('utf8');

                let splitebleArr = dataFileArr.split('\n');
                splitebleArr.forEach(i => {
                    if (i.match(parsebleUrl[2])) {
                        currentLine += i;
                    }
                });
                response.setHeader('Content-Type', 'application/json');
                response.statusCode = 201;
                response.end(JSON.stringify(currentLine));
            });
            break;
        case `/files/${parsebleUrl[2]}`:
            console.log(`Requested ${request.method} ${request.url} from ${remoteAddress}:${remotePort}`);

            let readFile3 = fs.createReadStream(FILE_ENV);
            let currentLine2 = '';
            let dataFileArr2 = [];

            readFile3.on('data', data => {
                let dataKey;
                dataFileArr2 = data.toString('utf8');

                let splitebleArr = dataFileArr2.split('\n');
                splitebleArr.forEach(i => {
                    if (i.match(parsebleUrl[2])) {
                        currentLine2 += i;
                    }
                });
                let [key,value] = currentLine2.split('=./');

                let file = fs.createReadStream(`./${value}`).pipe(response);
                let stat = fs.statSync(`./${value}`);
                response.setHeader('Content-Length', stat.size);
                response.setHeader('Content-Type', 'application/pdf');
                response.setHeader('Content-Disposition', `attachment; filename=${value}`);
                response.statusCode = 200;

            });
            break;
        default: 
            response.statusCode = 404;
            response.end('empty data');
    }
});

server.listen(PORT, err => {
    if (err) {
        return console.log(`Something went wrong: ${err}`);
    }

    console.log(`Server is running on port ${PORT}`);
});

TODO:
//Не работает отлавливание сигнала о закрытие сервера
// process.on('exit', (code) => {
//     console.log('This will not run');
// });