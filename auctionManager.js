/// Hello from auctionManager.js
// I conduct Auctions
var registeredAuctions = [];
var adapters = {};
var Auction = /** @class */ (function () {
    function Auction(slotID, slotSize) {
        this.bids = [];
        this.registerAuction = function () {
            this.auctionID = "A" + (this.slotID).toString();
        };
        this.closeAuction = function () {
            console.log("closing auction..");
        };
        this.getWinner = function () {
            console.log("calculating winner");
            //bidding logic
            //set winner
        };
        this.getStatus = function () {
            console.log("auction", this.auctionID, "is", this.status ? 'Closed' : 'Active');
            return this.status;
        };
        this.addBids = function (bidObjects) {
            this.bids.push(bidObjects);
        };
        this.slotID = slotID;
        this.slotSize = slotSize;
        this.status = false;
    }
    return Auction;
}());
