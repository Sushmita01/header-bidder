// Hello from logger.js
// I take care of sending things to log to the server
var message = "hey thereee";
var xhr = new XMLHttpRequest();
xhr.open('POST', 'http://localhost:3000/log', true);
xhr.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');
xhr.send(message);
xhr.onreadystatechange = function () {
};
