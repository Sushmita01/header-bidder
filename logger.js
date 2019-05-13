"use strict";
// Hello from logger.js
// I take care of sending things to log to the server
exports.__esModule = true;
var message = {
    providerResponses: null,
    auctionParticipants: null,
    auctionWinner: null
};
function logProviderResponse(response) {
    message.providerResponses = response;
}
exports.logProviderResponse = logProviderResponse;
function logAuctionParticipant(response) {
    var participants = {};
    for (var auction in response) {
        participants[auction] = response[auction].bids;
    }
    message.auctionParticipants = participants;
}
exports.logAuctionParticipant = logAuctionParticipant;
function logAuctionWinner(response) {
    var winners = {};
    for (var auction in response) {
        winners[auction] = { "provider": response[auction].winner.provider, "CPM": response[auction].winner.CPM };
    }
    message.auctionWinner = winners;
}
exports.logAuctionWinner = logAuctionWinner;
function postLog() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/log', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(message));
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Logs fired!");
        }
    };
}
exports.postLog = postLog;
