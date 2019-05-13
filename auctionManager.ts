/// Hello from auctionManager.js
// I conduct Auctions

export var registeredAuctions={};

export class Auction {
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
        console.log("closing auction..");
        this.status=true;
    }

    getWinner = function(){
        //bidding logic
        //set winner
        let maxBidCPM=0;
        let maxBidObject;
        for (let bid of this.bids) {
            if (bid.CPM>maxBidCPM) {
                maxBidObject=bid;
                maxBidCPM=bid.CPM;
            }
        }
        this.winner=maxBidObject;
    }

    getStatus = function(){
        console.log("auction",this.auctionID,"is",this.status?'Closed':'Active');
        return this.status;
    }
    
    addBids = function(bidObject) {
        this.bids.push(bidObject)
        
    }
    
}


export function closeAuctions() {
    for (let auction in registeredAuctions) {
        registeredAuctions[auction].closeAuction();
        registeredAuctions[auction].getWinner();
        console.log(registeredAuctions[auction]);

    }
    
}







