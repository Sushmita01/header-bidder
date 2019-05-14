"use strict";
exports.__esModule = true;
// Hello from headerBidder.js
// I am the core; I integrate all modules
var auctionManager = require("./auctionManager");
var adapterManager = require("./adapterManager");
var logger = require("./logger");
var slotDivMap = {};
for (var _i = 0, _a = config.adslots; _i < _a.length; _i++) {
    var slot = _a[_i];
    var divID = slot.divID;
    if (!slotDivMap.hasOwnProperty(divID)) {
        slotDivMap[divID] = slot.slot_id;
    }
}
var ProvIDMap = {};
for (var _b = 0, _c = config.providers; _b < _c.length; _b++) {
    var prov = _c[_b];
    var provID = prov.ID;
    if (!ProvIDMap.hasOwnProperty(provID)) {
        ProvIDMap[provID] = prov.Name;
    }
}
function replaceIDwithName(str) {
    for (var id in ProvIDMap) {
        if (str.indexOf(id) != -1) {
            str = str.replace(id, ProvIDMap[id]);
        }
    }
    return str;
}
window.hbShow = function hbShow(divID) {
    var currentDiv = document.getElementById(divID);
    var iframe = document.createElement('iframe');
    currentDiv.appendChild(iframe);
    var auctionID = "A" + slotDivMap[divID];
    var auction = auctionManager.registeredAuctions[auctionID];
    var winningAD = auction.winner.code.toString();
    winningAD = replaceIDwithName(winningAD);
    var height = auction.slotSize.split('x')[1];
    iframe.setAttribute('height', height);
    iframe.setAttribute('srcdoc', winningAD);
    console.log(currentDiv, "got rendered!");
};
//register auction for all slots
for (var _d = 0, _e = config.adslots; _d < _e.length; _d++) {
    var slot = _e[_d];
    // console.log("creating auction for",slot);
    var auctionObj = new auctionManager.Auction(slot['slot_id'], slot['dimension']);
    auctionObj.registerAuction();
    auctionManager.registeredAuctions[auctionObj.auctionID] = auctionObj;
    var bidsAdded = adapterManager.createAdapter(auctionObj);
    bidsAdded.then(function () {
        auctionManager.closeAuctions();
        logger.logAuctionWinner(auctionManager.registeredAuctions);
        logger.postLog();
    });
}
