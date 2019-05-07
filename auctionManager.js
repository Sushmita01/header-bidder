/// Hello from auctionManager.js
// I conduct Auctions
var registeredAuctions = [];
var adapters = {};
var Auction = /** @class */ (function () {
    function Auction(slotID, slotSize) {
        this.bids = [];
        this.registerAuction = function () {
            console.log("registering auctions..");
            this.auctionID = "A" + this.slotID;
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
        this.addBids = function () {
            //adds bids to adslot
        };
        this.slotID = slotID;
        this.slotSize = slotSize;
        this.status = false;
    }
    return Auction;
}());
createAdapter();
//core
for (var _i = 0, _a = config.adslots; _i < _a.length; _i++) {
    var slot = _a[_i];
    console.log("creating auction for", slot);
    var auctionObj = new Auction(slot['slot_id'], slot['dimension']);
    auctionObj.registerAuction();
}
