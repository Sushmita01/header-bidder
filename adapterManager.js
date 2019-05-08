// Hello from adapterManager.js
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
