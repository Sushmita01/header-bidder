/// Hello from auctionManager.js
// I conduct Auctions

var registeredAuctions=[];
var adapters={};

class Auction {
    auctionID: string;
    slotID: Number;
    slotSize: string;
    winner: string;
    status: boolean; //0=active; 1=closed
    bids = [];

    constructor (slotID: number , slotSize: string) {
        this.slotID=slotID;
        this.slotSize=slotSize;
        this.status= false;

    }
    registerAuction = function() {
        console.log("registering auctions..");
        this.auctionID="A"+this.slotID;       
        
    }

    closeAuction = function() {
        console.log("closing auction..")
    }

    getWinner = function(){
        console.log("calculating winner")
        //bidding logic
        //set winner
    }

    getStatus = function(){
        console.log("auction",this.auctionID,"is",this.status?'Closed':'Active');
        return this.status;
    }
    
    addBids = function() {
        //adds bids to adslot
        
    }
    
}


createAdapter();
//core
for (let slot of config.adslots) {
    console.log("creating auction for",slot);
    let auctionObj=new Auction(slot['slot_id'],slot['dimension']);
    auctionObj.registerAuction();
    
}


