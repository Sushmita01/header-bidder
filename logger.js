"use strict";
// Hello from logger.js
// I take care of sending things to log to the server
exports.__esModule = true;
function logProviderResponse(response) {
    console.log("provider response", response);
    postLog('providerResponses', response);
}
exports.logProviderResponse = logProviderResponse;
function logAuctionParticipant(response) {
    postLog('auctionParticipants', response);
}
exports.logAuctionParticipant = logAuctionParticipant;
function logAuctionWinner(response) {
    postLog('auctionWinners', response);
}
exports.logAuctionWinner = logAuctionWinner;
function postLog(endpoint, message) {
    var xhr = new XMLHttpRequest();
    console.log("postinggg");
    xhr.open('POST', "http://localhost:3000/log/" + endpoint, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(message));
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Logs fired!");
        }
    };
}
