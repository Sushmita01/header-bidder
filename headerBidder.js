// Hello from headerBidder.js
// I am the core; I integrate all modules
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
for (var _i = 0, _a = config.adslots; _i < _a.length; _i++) {
    var slot = _a[_i];
    // console.log("creating auction for",slot);
    var auctionObj = new Auction(slot['slot_id'], slot['dimension']);
    auctionObj.registerAuction();
    registeredAuctions[auctionObj.auctionID] = auctionObj;
    createAdapter(auctionObj);
}
