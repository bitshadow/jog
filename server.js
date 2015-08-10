var WebSocketServer = require('ws').Server,
    fs = require('fs'),
    Q = require('q'),
    path = require('path'),
    server = new WebSocketServer({
        port: 8080
    });

console.log("Websocket server started at ws://localhost:8080");

var fileLoader = {
    loadFile: function(file) {
        return Q.promise(function(resolve, reject) {
            if (!file) {
                reject(new Error('file not specified.'));
            }
            console.log(file);

            file = path.resolve(__dirname + '/js/' + file);
            var readFile = Q.denodeify(fs.readFile)(file, 'utf-8');

            readFile.done(function(data) {
                var obj = {
                    url: file,
                    contentType: /.js$/.test(file) ? 'text/javascript': 'text',
                    text: data.toString()
                }

                console.log(obj);
                resolve(obj);
            });

            readFile.fail(function(err) {
                reject(err.stack);
            });
        });
    }
}

server.on('connection', function open(ws) {

    ws.on('message', function(message) {
        try {
            var fileObj = JSON.parse(message);
            var loadFile = fileLoader.loadFile(fileObj.name);

            loadFile.then(function(data) {
                data = JSON.stringify(data);
                // send data to client
                ws.send(data);
            }, function(err) {
                console.log('load file error: ', err);
            });

        } catch (e) {
            console.log('Error parsing JSON object', e);
        }
    });
});

server.on('close', function close() {
    console.log('disconnected');
});
