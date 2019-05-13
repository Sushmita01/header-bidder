"use strict";
/// Hello from auctionManager.js
// I conduct Auctions
exports.__esModule = true;
exports.registeredAuctions = {};
var Auction = /** @class */ (function () {
    function Auction(slotID, slotSize) {
        this.bids = [];
        this.registerAuction = function () {
            this.auctionID = "A" + (this.slotID).toString();
        };
        this.closeAuction = function () {
            console.log("closing auction..");
            this.status = true;
        };
        this.getWinner = function () {
            //bidding logic
            //set winner
            var maxBidCPM = 0;
            var maxBidObject;
            for (var _i = 0, _a = this.bids; _i < _a.length; _i++) {
                var bid = _a[_i];
                if (bid.CPM > maxBidCPM) {
                    maxBidObject = bid;
                    maxBidCPM = bid.CPM;
                }
            }
            this.winner = maxBidObject;
        };
        this.getStatus = function () {
            console.log("auction", this.auctionID, "is", this.status ? 'Closed' : 'Active');
            return this.status;
        };
        this.addBids = function (bidObject) {
            this.bids.push(bidObject);
        };
        this.slotID = slotID;
        this.slotSize = slotSize;
        this.status = false;
    }
    return Auction;
}());
exports.Auction = Auction;
function closeAuctions() {
    for (var auction in exports.registeredAuctions) {
        exports.registeredAuctions[auction].closeAuction();
        exports.registeredAuctions[auction].getWinner();
        console.log(exports.registeredAuctions[auction]);
    }
}
exports.closeAuctions = closeAuctions;
