// Hello from headerBidder.js
// I am the core; I integrate all modules
var slotDivMap = {};
for (var _i = 0, _a = config.adslots; _i < _a.length; _i++) {
    var slot = _a[_i];
    var slotID = slot.slot_id;
    if (!slotDivMap.hasOwnProperty(slotID)) {
        slotDivMap[slotID] = slot.divID;
    }
}
console.log(slotDivMap);
function show(auction) {
    var divID = auction.slotID.toString();
    var currentDiv = document.getElementById(divID);
    var winningAD = auction.winner.code;
    var height = auction.slotSize.split('x')[0];
    currentDiv.style.height = height;
    var iframe = document.createElement("iframe");
    iframe.setAttribute("srcdoc", winningAD);
    iframe.setAttribute("height", height);
    currentDiv.appendChild(iframe);
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
