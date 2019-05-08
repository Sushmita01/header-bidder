// Hello from headerBidder.js
// I am the core; I integrate all modules
createAdapter();
//register auction for all slots
for (var _i = 0, _a = config.adslots; _i < _a.length; _i++) {
    var slot = _a[_i];
    console.log("creating auction for", slot);
    var auctionObj = new Auction(slot['slot_id'], slot['dimension']);
    auctionObj.registerAuction();
    registeredAuctions.push(auctionObj);
}
