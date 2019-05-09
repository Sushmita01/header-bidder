// Hello from adapterManager.js
// I make adapter objects from provider-adslot maps
var bidParams = [];
var Bid = /** @class */ (function () {
    function Bid(CPM, code, provider) {
        this.CPM = CPM;
        this.code = code;
        this.provider = provider;
    }
    return Bid;
}());
var Adapter = /** @class */ (function () {
    function Adapter(auctionID, noBid, EPC, size, provider, floorPrice) {
        this.auctionID = auctionID;
        this.noBid = noBid;
        this.EPC = EPC;
        this.size = size;
        this.provider = provider;
        this.floorPrice = floorPrice;
    }
    ;
    return Adapter;
}());
function createBid(adapter) {
    //create a bid object
    return new Bid(adapter.CPM, adapter.code, adapter.provider);
}
function getBid(currentAdapter, len) {
    //get bids
    // construct an HTTP request
    bidParams.push(currentAdapter);
    if (bidParams.length == len) {
        //now we can make a call for bids
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/getBid', true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        // send the collected data as JSON
        xhr.send(JSON.stringify(bidParams));
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var bidResponse = JSON.parse(this.responseText);
                if (bidResponse.length == len) {
                    console.log("all bids received", bidResponse);
                    for (var _i = 0, bidResponse_1 = bidResponse; _i < bidResponse_1.length; _i++) {
                        var adapter = bidResponse_1[_i];
                        var relevantAuction = adapter.auctionID;
                        if (adapter.noBid == false) { //if adapter received a valid bid then create a bid object
                            var newBid = createBid(adapter);
                            registeredAuctions[relevantAuction].addBids(newBid); //calling addBids of relevant auction
                        }
                        // console.log(`adding bids..`,registeredAuctions[relevantAuction]);
                    }
                    closeAuctions();
                }
            }
        };
    }
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
function createAdapter(auctionObj) {
    console.log("current", auctionObj); //has slot details
    for (var _i = 0, _a = config.AdslotProvidersMap; _i < _a.length; _i++) { //looping through providers map for a particular publisher
        var mapObject = _a[_i];
        //only create adapter if slot matches the slot put up for auction
        if (mapObject['slotID'] == auctionObj['slotID']) {
            var currentProv = providerIDMap[mapObject['providerID']]; //publisher, provider
            var currentAdapter = new Adapter(auctionObj.auctionID, true, mapObject['slotID'], auctionObj['slotSize'], currentProv, mapObject['FloorPrice']);
            // console.log("currentAdapter",currentAdapter);
            getBid(currentAdapter, config.AdslotProvidersMap.length); //getting bids
        }
    }
}
