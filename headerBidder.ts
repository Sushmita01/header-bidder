// Hello from headerBidder.js
// I am the core; I integrate all modules
var slotDivMap={};
for (let slot of config.adslots) {
    let divID=slot.divID;
    if (!slotDivMap.hasOwnProperty(divID)) {
        slotDivMap[divID]=slot.slot_id;
    }

}

function hbShow(divID) {
        let currentDiv=document.getElementById(divID);
        let iframe=document.createElement('iframe');
        currentDiv.appendChild(iframe)
        let auctionID="A"+slotDivMap[divID];
        let auction=registeredAuctions[auctionID];
        let winningAD=auction.winner.code.toString();
        let height=auction.slotSize.split('x')[1];
        iframe.outerHTML="<iframe height="+height+"></iframe>";
        let customIframe=currentDiv.children[1];
        customIframe.setAttribute('srcdoc',winningAD);
        console.log(currentDiv);
    }
    

//register auction for all slots
for (let slot of config.adslots) {
    // console.log("creating auction for",slot);
    let auctionObj=new Auction(slot['slot_id'],slot['dimension']);
    auctionObj.registerAuction();
    registeredAuctions[auctionObj.auctionID]=auctionObj;
    createAdapter(auctionObj);
}







