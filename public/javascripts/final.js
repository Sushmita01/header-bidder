var config={publisherDetails:[{"ID":345,"Name":"Recipe.com","isActive":1}],adslots: [{"publisher_id":345,"slot_id":61,"dimension":"300x300","slot_name":"middle"},{"publisher_id":345,"slot_id":63,"dimension":"100x200","slot_name":"bottom"}],providers: [{"ID":1,"Name":"OpenX","EntryPoint":"bid/openx"},{"ID":2,"Name":"Media.net","EntryPoint":"bid/media"},{"ID":3,"Name":"AppNexus","EntryPoint":"bid/nexus"},{"ID":4,"Name":"Platform.io","EntryPoint":"bid/platform"}],AdslotProvidersMap:[{"slotID":61,"providerID":1,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":100,"FloorPrice":400},{"slotID":61,"providerID":2,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":200,"FloorPrice":500},{"slotID":61,"providerID":3,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":100,"FloorPrice":400},{"slotID":61,"providerID":4,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":100,"FloorPrice":400},{"slotID":63,"providerID":1,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":100,"FloorPrice":700},{"slotID":63,"providerID":3,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":100,"FloorPrice":600}]};// Hello from headerBidder.js
// I am the core; I integrate all modules
//register auction for all slots
// Hello from adapterManager.js
// I make adapter objects from provider-adslot maps
//adapter
var bidParams = [];
var Adapter = /** @class */ (function () {
    function Adapter(bidAmount) {
        this.bidAmount = bidAmount;
    }
    return Adapter;
}());
function createAdapter() {
    var providerIDMap = {};
    for (var _i = 0, _a = config.providers; _i < _a.length; _i++) {
        var prov = _a[_i];
        if (!(providerIDMap.hasOwnProperty(prov.ID))) {
            providerIDMap[prov.ID] = prov.Name;
        }
    }
    for (var _b = 0, _c = config.AdslotProvidersMap; _b < _c.length; _b++) {
        var mapObject = _c[_b];
        bidParams.push({ 'slotID': mapObject['slotID'], 'providerID': mapObject['providerID'], 'floorPrice': mapObject['FloorPrice'] });
        console.log(bidParams);
        var currentProv = providerIDMap[mapObject['providerID']];
        var adapterObject = {};
        if (adapters.hasOwnProperty(mapObject.slotID)) {
            adapters[mapObject.slotID][currentProv] = adapterObject;
        }
        else {
            adapters[mapObject.slotID] = {};
            adapters[mapObject.slotID][currentProv] = adapterObject;
        }
    }
    console.log(adapters);
    console.log(bidParams);
}
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
"use strict";
// Hello from logger.js
// I take care of logging things to the console
exports.__esModule = true;
exports.little = "hel";
