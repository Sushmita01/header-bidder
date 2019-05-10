// Hello from headerBidder.js
// I am the core; I integrate all modules
var slotDivMap={};
for (let slot of config.adslots) {
    let divID=slot.divID;
    if (!slotDivMap.hasOwnProperty(divID)) {
        slotDivMap[divID]=slot.slot_id;
    }

}

console.log(slotDivMap)


function hbShow(divID) {
        let iframe=document.getElementById(divID);
        let currentDiv=iframe.parentNode;
        console.log(currentDiv);
        let auctionID="A"+slotDivMap[divID];
        let auction=registeredAuctions[auctionID];
        let winningAD=auction.winner.code.toString();
        let height=auction.slotSize.split('x')[1];
        iframe.outerHTML="<iframe height="+height+" id="+divID+"></iframe>";
        let modified=document.getElementById(divID);
        modified.setAttribute('srcdoc',winningAD);
        console.log(modified);
    }
    

//register auction for all slots
for (let slot of config.adslots) {
    // console.log("creating auction for",slot);
    let auctionObj=new Auction(slot['slot_id'],slot['dimension']);
    auctionObj.registerAuction();
    registeredAuctions[auctionObj.auctionID]=auctionObj;
    createAdapter(auctionObj);
}







