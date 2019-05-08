var config={publisherDetails:[{"ID":345,"Name":"Recipe.com","isActive":1}],adslots: [{"publisher_id":345,"slot_id":617934,"dimension":"300x300","slot_name":"middle"},{"publisher_id":345,"slot_id":638257,"dimension":"100x200","slot_name":"bottom"}],providers: [{"ID":1,"Name":"OpenX","EntryPoint":"bid/openx"},{"ID":2,"Name":"Media.net","EntryPoint":"bid/media"},{"ID":3,"Name":"AppNexus","EntryPoint":"bid/nexus"},{"ID":4,"Name":"Platform.io","EntryPoint":"bid/platform"}],AdslotProvidersMap:[{"slotID":617934,"providerID":1,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":100,"FloorPrice":400},{"slotID":617934,"providerID":2,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":200,"FloorPrice":400},{"slotID":617934,"providerID":3,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":100,"FloorPrice":400},{"slotID":617934,"providerID":4,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":100,"FloorPrice":400},{"slotID":638257,"providerID":1,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":100,"FloorPrice":500},{"slotID":638257,"providerID":3,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":100,"FloorPrice":500}]};// Hello from adapterManager.js
// I make adapter objects from provider-adslot maps
var adapters = {};
var Bid = /** @class */ (function () {
    function Bid() {
    }
    return Bid;
}());
var Adapter = /** @class */ (function () {
    function Adapter(noBid, code, EPC, size) {
        this.noBid = noBid;
        this.code = code;
        this.EPC = EPC;
        this.size = size;
    }
    return Adapter;
}());
function getBids(params) {
    //get bids
    this.params = params;
    console.log("params to fetch bids", params);
    // construct an HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/getBid', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    // send the collected data as JSON
    xhr.send(JSON.stringify(params));
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var bidResponse = JSON.parse(this.responseText);
            console.log("response bid", bidResponse);
            mapBidsToAdapters(bidResponse);
        }
    };
}
function addBidsToAuction() {
    for (var _i = 0, registeredAuctions_1 = registeredAuctions; _i < registeredAuctions_1.length; _i++) {
        var auction = registeredAuctions_1[_i];
        console.log(auction);
    }
}
function mapBidsToAdapters(bidResponse) {
    for (var _i = 0, bidResponse_1 = bidResponse; _i < bidResponse_1.length; _i++) {
        var bid = bidResponse_1[_i];
        var currSlot = bid.slotID;
        var currProv = bid.providerID;
        adapters[currSlot][currProv].bidAmount = bid.amount;
        adapters[currSlot][currProv].noBid = false;
    }
    addBidsToAuction();
}
//create provider ID-Name map
var providerIDMap = {};
for (var _i = 0, _a = config.providers; _i < _a.length; _i++) {
    var prov = _a[_i];
    if (!(providerIDMap.hasOwnProperty(prov.ID))) {
        providerIDMap[prov.ID] = prov.Name;
    }
}
//create provider ID-Name map
var adSlotSizeMap = {};
for (var _b = 0, _c = config.adslots; _b < _c.length; _b++) {
    var ad = _c[_b];
    if (!(adSlotSizeMap.hasOwnProperty(ad['slot_id']))) {
        adSlotSizeMap[ad['slot_id']] = ad['dimension'];
    }
}
function createAdapter() {
    var bidParams = [];
    for (var _i = 0, _a = config.AdslotProvidersMap; _i < _a.length; _i++) {
        var mapObject = _a[_i];
        bidParams.push({ 'slotID': mapObject['slotID'], 'providerID': providerIDMap[mapObject['providerID']], 'floorPrice': mapObject['FloorPrice'] });
        var currentProv = providerIDMap[mapObject['providerID']];
        var adapterObject = new Adapter(true, '<h1>some ad code</h1>', mapObject['slotID'], adSlotSizeMap[mapObject['slotID']]);
        if (adapters.hasOwnProperty(mapObject.slotID)) {
            adapters[mapObject.slotID][currentProv] = adapterObject;
        }
        else {
            adapters[mapObject.slotID] = {};
            adapters[mapObject.slotID][currentProv] = adapterObject;
        }
    }
    console.log("Adapters", adapters);
    getBids(bidParams);
}
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
// Hello from logger.js
// I take care of logging things to the console
// Hello from headerBidder.js
// I am the core; I integrate all modules
createAdapter();
//register auction for all slots
for (var _i = 0, _a = config.adslots; _i < _a.length; _i++) {
    var slot = _a[_i];
    console.log("creating auction for", slot);
    var auctionObj = new Auction(slot['slot_id'], slot['dimension']);
    auctionObj.registerAuction();
    registeredAuctions.push(auctionObj);
}
