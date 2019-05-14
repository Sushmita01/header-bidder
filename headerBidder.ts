// Hello from headerBidder.js
// I am the core; I integrate all modules
import * as auctionManager from './auctionManager';
import * as adapterManager from './adapterManager';
import * as logger from './logger';




var slotDivMap={};
for (let slot of config.adslots) {
    let divID=slot.divID;
    if (!slotDivMap.hasOwnProperty(divID)) {
        slotDivMap[divID]=slot.slot_id;
    }

}

var ProvIDMap={};
for (let prov of config.providers) {
    let provID=prov.ID;
    if (!ProvIDMap.hasOwnProperty(provID)) {
        ProvIDMap[provID]=prov.Name;
    }

}

function replaceIDwithName(str) {
    for (let id in ProvIDMap) {
        if (str.indexOf(id)!=-1) {
            str=str.replace(id, ProvIDMap[id])
        }
    }
    return str
}

window.hbShow=function hbShow(divID) {
        let currentDiv=document.getElementById(divID);
        let iframe=document.createElement('iframe');
        currentDiv.appendChild(iframe)
        let auctionID="A"+slotDivMap[divID];
        let auction=auctionManager.registeredAuctions[auctionID];
        let winningAD=auction.winner.code.toString();
        winningAD=replaceIDwithName(winningAD)
        let height=auction.slotSize.split('x')[1];
        iframe.setAttribute('height',height)
        iframe.setAttribute('srcdoc',winningAD);
        console.log(currentDiv,"got rendered!");
    }
    

//register auction for all slots
for (let slot of config.adslots) {
    // console.log("creating auction for",slot);
    let auctionObj=new auctionManager.Auction(slot['slot_id'],slot['dimension']);
    auctionObj.registerAuction();
    auctionManager.registeredAuctions[auctionObj.auctionID]=auctionObj;
    let bidsAdded=adapterManager.createAdapter(auctionObj);
    bidsAdded.then(()=> {
        auctionManager.closeAuctions();
        logger.logAuctionWinner(auctionManager.registeredAuctions)
        logger.postLog();
    })
}







