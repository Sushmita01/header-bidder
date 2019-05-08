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
        this.auctionID="A"+(this.slotID).toString();       
        
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
    
    addBids = function(bidObjects) {
        this.bids.push(bidObjects)
        
    }
    
}


