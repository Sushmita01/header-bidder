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
