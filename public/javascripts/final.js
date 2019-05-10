var config={publisherDetails:[{"ID":345,"Name":"Recipe.com","isActive":1}],adslots: [{"publisher_id":345,"slot_id":617934,"divID":"adslot2","dimension":"300x200","slot_name":"bottom"},{"publisher_id":345,"slot_id":638257,"divID":"adslot1","dimension":"400x200","slot_name":"middle"}],providers: [{"ID":"OX3845","Name":"OpenX","EntryPoint":"getBid"},{"ID":"AP8875","Name":"AppNexus","EntryPoint":"getBid"},{"ID":"MD5697","Name":"Media.net","EntryPoint":"getBid"},{"ID":"PI7654","Name":"Platform.io","EntryPoint":"getBid"}],AdslotProvidersMap:[{"slotID":617934,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":0.2,"FloorPrice":2,"providerID":"OX3845"},{"slotID":617934,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":0.3,"FloorPrice":2,"providerID":"AP8875"},{"slotID":617934,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":0.2,"FloorPrice":2,"providerID":"MD5697"},{"slotID":617934,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":0.1,"FloorPrice":2,"providerID":"PI7654"},{"slotID":638257,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":0.1,"FloorPrice":3,"providerID":"PI7654"},{"slotID":638257,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":0.2,"FloorPrice":3,"providerID":"MD5697"}]};// Hello from adapterManager.js
// I make adapter objects from provider-adslot maps
var bidParams = [];
var adapters = [];
var Bid = /** @class */ (function () {
    function Bid(CPM, code, provider) {
        this.CPM = CPM;
        this.code = code;
        this.provider = provider;
    }
    return Bid;
}());
var Adapter = /** @class */ (function () {
    function Adapter(auctionID, noBid, slotID, size, providerID, floorPrice) {
        this.getBid = function () {
            var bidParam = { slotID: this.slotID, providerID: this.providerID, floorPrice: this.floorPrice, size: this.size };
            return makeBidRequest(bidParam);
        };
        this.auctionID = auctionID;
        this.noBid = noBid;
        this.slotID = slotID;
        this.size = size;
        this.providerID = providerID;
        this.floorPrice = floorPrice;
    }
    return Adapter;
}());
function createBid(adapter) {
    //create a bid object
    return new Bid(adapter.CPM, adapter.code, adapter.providerID);
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
                        logProviderResponse(bidResponse); //pushing to log channel
                        resolve(bidResponse);
                    }
                }
            };
        }
    });
}
function createAdapter(auctionObj) {
    console.log("current", auctionObj); //has slot details
    for (var _i = 0, _a = config.AdslotProvidersMap; _i < _a.length; _i++) { //looping through providers map for a particular publisher
        var mapObject = _a[_i];
        //only create adapter if slot matches the slot put up for auction
        if (mapObject['slotID'] == auctionObj['slotID']) {
            var currentAdapter = new Adapter(auctionObj.auctionID, true, mapObject['slotID'], auctionObj['slotSize'], mapObject['providerID'], mapObject['FloorPrice']);
            adapters.push(currentAdapter);
            var bidPromise = currentAdapter.getBid(); //getting bids
            bidPromise.then(function (data) {
                for (var _i = 0, adapters_1 = adapters; _i < adapters_1.length; _i++) {
                    var ad = adapters_1[_i];
                    for (var _a = 0, data_1 = data; _a < data_1.length; _a++) {
                        var bid = data_1[_a];
                        if (ad.providerID == bid.providerID && ad.slotID == bid.slotID) {
                            var relevantAuction = ad.auctionID;
                            ad.noBid == false; //if adapter received a valid bid then create a bid object
                            var newBid = createBid(bid);
                            registeredAuctions[relevantAuction].addBids(newBid); //calling addBids of relevant auction
                        }
                    }
                }
                logAuctionParticipant(registeredAuctions);
                closeAuctions();
            });
        }
    }
}
/// Hello from auctionManager.js
// I conduct Auctions
var registeredAuctions = {};
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
function closeAuctions() {
    for (var auction in registeredAuctions) {
        registeredAuctions[auction].closeAuction();
        registeredAuctions[auction].getWinner();
        // show(registeredAuctions[auction]);
        console.log(registeredAuctions[auction]);
    }
    logAuctionWinner(registeredAuctions);
    postLog();
}
// Hello from logger.js
// I take care of sending things to log to the server
var message = {
    providerResponses: null,
    auctionParticipants: null,
    auctionWinner: null
};
function logProviderResponse(response) {
    message.providerResponses = response;
}
function logAuctionParticipant(response) {
    var participants = {};
    for (var auction in response) {
        participants[auction] = response[auction].bids;
    }
    message.auctionParticipants = participants;
}
function logAuctionWinner(response) {
    var winners = {};
    for (var auction in response) {
        winners[auction] = { "provider": response[auction].winner.provider, "CPM": response[auction].winner.CPM };
    }
    message.auctionWinner = winners;
}
function postLog() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/log', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(message));
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Logs fired!");
        }
    };
}
// Hello from headerBidder.js
// I am the core; I integrate all modules
var slotDivMap = {};
for (var _i = 0, _a = config.adslots; _i < _a.length; _i++) {
    var slot = _a[_i];
    var divID = slot.divID;
    if (!slotDivMap.hasOwnProperty(divID)) {
        slotDivMap[divID] = slot.slot_id;
    }
}
console.log(slotDivMap);
function hbShow(divID) {
    var iframe = document.getElementById(divID);
    var currentDiv = iframe.parentNode;
    console.log(currentDiv);
    var auctionID = "A" + slotDivMap[divID];
    var auction = registeredAuctions[auctionID];
    var winningAD = auction.winner.code.toString();
    var height = auction.slotSize.split('x')[1];
    // currentDiv.style.height=height;
    // iframe['height']=height;
    iframe.outerHTML = "<iframe height=" + height + " id=" + divID + "></iframe>";
    var modified = document.getElementById(divID);
    modified.setAttribute('srcdoc', winningAD);
    console.log(modified);
    // new_element.removeEventListener("load", ()=> {
    //     console.log('render complete')
    //     console.log(iframe);
    // },true)
}
//register auction for all slots
for (var _b = 0, _c = config.adslots; _b < _c.length; _b++) {
    var slot = _c[_b];
    // console.log("creating auction for",slot);
    var auctionObj = new Auction(slot['slot_id'], slot['dimension']);
    auctionObj.registerAuction();
    registeredAuctions[auctionObj.auctionID] = auctionObj;
    createAdapter(auctionObj);
}
