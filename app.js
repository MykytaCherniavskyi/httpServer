const http = require('http');
const fs = require('fs');
const path = require('path');

const FILE_ENV = path.resolve(__dirname, "node.env");
const PORT = 3000;

const server = http.createServer((request, response) => {
    const { remoteAddress, remotePort } = response.socket;
    let parsebleUrl = request.url.split('/');
    // console.log(parsebleUrl[2]);

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
        default: 
            response.statusCode = 404;
            response.end('empty data');
    }
    // response.setHeader('Content-Type', 'application/json');
    // response.statusCode = 201;
    // response.end(JSON.stringify({data: 'Hello world'}));
});

server.listen(PORT, err => {
    if (err) {
        return console.log(`Something went wrong: ${err}`);
    }

    console.log(`Server is running on port ${PORT}`);
});
