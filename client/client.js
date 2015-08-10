
function reloadFile (fileObj) {
    var scriptTag = document.createElement('script');

    scriptTag.setAttribute('type', fileObj.contentType);
    var textNode = document.createTextNode(fileObj.text);
    scriptTag.appendChild(textNode);

    document.head.appendChild(scriptTag);
}

var ws = new WebSocket('ws://localhost:8080');

ws.onopen = function open() {
    var obj = { name: 'alert.js' };
    var data = JSON.stringify(obj);
    ws.send(data);
};

ws.onmessage = function(message) {
    var obj = JSON.parse(message.data);

    reloadFile(obj);
};

var reload = document.querySelector('.reload');
reload.addEventListener('click', function(e){
    var obj = { name: 'alert.js' };
    var data = JSON.stringify(obj);
    ws.send(data);
});
