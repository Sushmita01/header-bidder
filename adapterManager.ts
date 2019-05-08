// Hello from adapterManager.js
// I make adapter objects from provider-adslot maps

var adapters={};

class Bid {

}
class Adapter {
    bidAmount : number;
    noBid :  boolean;
    code : string;
    EPC : number;
    size : string;

    constructor(noBid,code,EPC,size) {
        this.noBid=noBid;
        this.code=code;
        this.EPC=EPC;
        this.size=size;
    }
}


function getBids(params)  {
    //get bids
    this.params=params;
    console.log("params to fetch bids",params);
     // construct an HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/getBid' , true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // send the collected data as JSON
    xhr.send(JSON.stringify(params));

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let bidResponse=JSON.parse(this.responseText);
          console.log("response bid",bidResponse);
          mapBidsToAdapters(bidResponse);
        }
      };

}

function addBidsToAuction() {
    for (let auction of registeredAuctions) {
        console.log(auction)
    }
}

function mapBidsToAdapters(bidResponse) {
    for (let bid of bidResponse) {
        let currSlot=bid.slotID;
        let currProv=bid.providerID;
        adapters[currSlot][currProv].bidAmount=bid.amount;
        adapters[currSlot][currProv].noBid=false;

    }
    addBidsToAuction();
}

//create provider ID-Name map
let providerIDMap={};
for (let prov of config.providers) {
   if (!(providerIDMap.hasOwnProperty(prov.ID))) {
       providerIDMap[prov.ID]=prov.Name;
   }
}

//create provider ID-Name map
let adSlotSizeMap={};
     for (let ad of config.adslots) {
        if (!(adSlotSizeMap.hasOwnProperty(ad['slot_id']))) {
            adSlotSizeMap[ad['slot_id']]=ad['dimension'];
        }
     }


function createAdapter()
 {   let bidParams=[];
     for (let mapObject of config.AdslotProvidersMap) {
        
        bidParams.push({'slotID':mapObject['slotID'],'providerID':providerIDMap[mapObject['providerID']],'floorPrice':mapObject['FloorPrice']});

        let currentProv=providerIDMap[mapObject['providerID']];

        let adapterObject = new Adapter(true,'<h1>some ad code</h1>',mapObject['slotID'],adSlotSizeMap[mapObject['slotID']]);
        if (adapters.hasOwnProperty(mapObject.slotID)) {
            adapters[mapObject.slotID][currentProv] = adapterObject;
        }
        else {
            adapters[mapObject.slotID]={};
            adapters[mapObject.slotID][currentProv] = adapterObject;

        }
     }
     console.log("Adapters",adapters)
     getBids(bidParams);

     

 }



