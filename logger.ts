// Hello from logger.js
// I take care of sending things to log to the server

export function logProviderResponse(response) {     
    console.log("provider response",response)
    postLog('providerResponses',response);
}

export function logAuctionParticipant(response) {

    postLog('auctionParticipants',response);
}

export function logAuctionWinner(response) {
    postLog('auctionWinners',response);
}


function postLog(endpoint,message) {
    var xhr = new XMLHttpRequest();
    console.log("postinggg")
    xhr.open('POST', `http://localhost:3000/log/${endpoint}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(message));
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Logs fired!")
        }
    };

}


