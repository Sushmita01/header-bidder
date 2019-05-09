var config={publisherDetails:[{"ID":345,"Name":"Recipe.com","isActive":1}],adslots: [{"publisher_id":345,"slot_id":617934,"dimension":"300x200","slot_name":"bottom"},{"publisher_id":345,"slot_id":638257,"dimension":"400x200","slot_name":"middle"}],providers: [{"ID":1,"Name":"OpenX","EntryPoint":"bid/openx"},{"ID":2,"Name":"Media.net","EntryPoint":"bid/media"},{"ID":3,"Name":"AppNexus","EntryPoint":"bid/nexus"},{"ID":4,"Name":"Platform.io","EntryPoint":"bid/platform"}],AdslotProvidersMap:[{"slotID":617934,"providerID":1,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":1,"FloorPrice":2.5},{"slotID":617934,"providerID":2,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":2,"FloorPrice":2.5},{"slotID":617934,"providerID":3,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":1,"FloorPrice":2.5},{"slotID":617934,"providerID":4,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":1,"FloorPrice":2.5},{"slotID":638257,"providerID":1,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":1.5,"FloorPrice":3},{"slotID":638257,"providerID":3,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":2,"FloorPrice":3}]};// Hello from adapterManager.js
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
            console.log("calculating winner");
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
        show(registeredAuctions[auction]);
        console.log(registeredAuctions[auction]);
    }
}
// Hello from logger.js
// I take care of sending things to log to the server
var message = "hey thereee";
var xhr = new XMLHttpRequest();
xhr.open('POST', 'http://localhost:3000/log', true);
xhr.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');
xhr.send(message);
xhr.onreadystatechange = function () {
};
// Hello from headerBidder.js
// I am the core; I integrate all modules
function show(auction) {
    var divID = auction.slotID.toString();
    var currentDiv = document.getElementById(divID);
    var winningAD = auction.winner.code;
    var height = auction.slotSize.split('x')[0];
    currentDiv.style.height = height;
    var iframe = document.createElement("iframe");
    iframe.setAttribute("srcdoc", winningAD);
    iframe.setAttribute("height", height);
    currentDiv.appendChild(iframe);
    console.log(currentDiv);
}
//register auction for all slots
for (var _i = 0, _a = config.adslots; _i < _a.length; _i++) {
    var slot = _a[_i];
    // console.log("creating auction for",slot);
    var auctionObj = new Auction(slot['slot_id'], slot['dimension']);
    auctionObj.registerAuction();
    registeredAuctions[auctionObj.auctionID] = auctionObj;
    createAdapter(auctionObj);
}
