// Hello from headerBidder.js
// I am the core; I integrate all modules

function show(auction) {
    let divID=auction.slotID.toString();
    let currentDiv=document.getElementById(divID);
    let winningAD=auction.winner.code;
    let height=auction.slotSize.split('x')[0];
    currentDiv.style.height=height;
    var iframe = document.createElement("iframe");
    iframe.setAttribute("srcdoc",winningAD)
    iframe.setAttribute("height",height)
    currentDiv.appendChild(iframe) 
}

//register auction for all slots
for (let slot of config.adslots) {
    // console.log("creating auction for",slot);
    let auctionObj=new Auction(slot['slot_id'],slot['dimension']);
    auctionObj.registerAuction();
    registeredAuctions[auctionObj.auctionID]=auctionObj;
    createAdapter(auctionObj);
}







