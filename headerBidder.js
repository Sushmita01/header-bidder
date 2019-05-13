// Hello from headerBidder.js
// I am the core; I integrate all modules
var slotDivMap = {};
for (var _i = 0, _a = config.adslots; _i < _a.length; _i++) {
    var slot = _a[_i];
    var divID = slot.divID;
    if (!slotDivMap.hasOwnProperty(divID)) {
        slotDivMap[divID] = slot.slot_id;
    }
}
function hbShow(divID) {
    var currentDiv = document.getElementById(divID);
    var iframe = document.createElement('iframe');
    currentDiv.appendChild(iframe);
    var auctionID = "A" + slotDivMap[divID];
    var auction = registeredAuctions[auctionID];
    var winningAD = auction.winner.code.toString();
    var height = auction.slotSize.split('x')[1];
    iframe.setAttribute('height', height);
    iframe.setAttribute('srcdoc', winningAD);
    console.log(currentDiv);
}
//register auction for all slots
for (var _b = 0, _c = config.adslots; _b < _c.length; _b++) {
    var slot = _c[_b];
    // console.log("creating auction for",slot);
    var auctionObj = new Auction(slot['slot_id'], slot['dimension']);
    auctionObj.registerAuction();
    registeredAuctions[auctionObj.auctionID] = auctionObj;
    createAdapter(auctionObj);
}
