// Hello from headerBidder.js
// I am the core; I integrate all modules

createAdapter();

//register auction for all slots
for (let slot of config.adslots) {
    console.log("creating auction for",slot);
    let auctionObj=new Auction(slot['slot_id'],slot['dimension']);
    auctionObj.registerAuction();
    registeredAuctions.push(auctionObj);
}

