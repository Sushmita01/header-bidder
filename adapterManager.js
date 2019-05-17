"use strict";
// Hello from adapterManager.js
// I make adapter objects from provider-adslot maps
exports.__esModule = true;
var auctionManager = require("./auctionManager");
var logger = require("./logger");
var bidParams = [];
var adapters = [];
var Bid = /** @class */ (function () {
    function Bid(CPM, code, EPC, provider) {
        this.CPM = CPM;
        this.code = code;
        this.EPC = EPC;
        this.provider = provider;
    }
    return Bid;
}());
var Adapter = /** @class */ (function () {
    function Adapter(auctionID, noBid, slotID, EPC, size, providerID, floorPrice) {
        this.getBid = function () {
            var bidParam = { slotID: this.slotID, EPC: this.EPC, providerID: this.providerID, floorPrice: this.floorPrice, size: this.size };
            return makeBidRequest(bidParam);
        };
        this.auctionID = auctionID;
        this.noBid = noBid;
        this.slotID = slotID;
        this.EPC = EPC;
        this.size = size;
        this.providerID = providerID;
        this.floorPrice = floorPrice;
    }
    return Adapter;
}());
function createBid(adapter) {
    //create a bid object
    return new Bid(adapter.CPM, adapter.code, adapter.EPC, adapter.providerID);
}
function makeBidRequest(bidParam) {
    bidParams.push(bidParam);
    return new Promise(function (resolve, reject) {
        // Do async job
        if (bidParams.length == config.AdslotProvidersMap.length) {
            //now we can make a call for bids
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:3000/getBid', true);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            xhr.timeout = 300;
            // send the collected data as JSON
            xhr.send(JSON.stringify(bidParams));
            xhr.ontimeout = function (e) {
                console.log('No bids received.Could not complete in 300ms');
            };
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var bidResponse = JSON.parse(this.responseText);
                    if (bidResponse.length == config.AdslotProvidersMap.length) {
                        console.log("all bids received", bidResponse);
                        -resolve(bidResponse);
                    }
                }
            };
        }
    });
}
function createAdapter(auctionObj) {
    console.log("current", auctionObj); //has slot details
    return new Promise(function (resolve, reject) {
        // Do async job
        for (var _i = 0, _a = config.AdslotProvidersMap; _i < _a.length; _i++) { //looping through providers map for a particular publisher
            var mapObject = _a[_i];
            //only create adapter if slot matches the slot put up for auction
            if (mapObject['slotID'] == auctionObj['slotID']) {
                var currentAdapter = new Adapter(auctionObj.auctionID, true, mapObject['slotID'], mapObject['ExternalPlacementID'], auctionObj['slotSize'], mapObject['providerID'], mapObject['FloorPrice']);
                adapters.push(currentAdapter);
                var bidPromise = currentAdapter.getBid(); //getting bids
                bidPromise.then(function (data) {
                    logger.logProviderResponse(data);
                    for (var _i = 0, adapters_1 = adapters; _i < adapters_1.length; _i++) {
                        var ad = adapters_1[_i];
                        for (var _a = 0, data_1 = data; _a < data_1.length; _a++) {
                            var bid = data_1[_a];
                            if (ad.providerID == bid.providerID && ad.slotID == bid.slotID) {
                                var relevantAuction = ad.auctionID;
                                // ad.noBid==false                  //if adapter received a valid bid then create a bid object
                                var newBid = createBid(bid);
                                auctionManager.registeredAuctions[relevantAuction].addBids(newBid); //calling addBids of relevant auction
                            }
                        }
                    }
                    logger.logAuctionParticipant(auctionManager.registeredAuctions);
                    resolve(true);
                    // 
                });
            }
        }
    });
}
exports.createAdapter = createAdapter;
