// Hello from adapterManager.js
// I make adapter objects from provider-adslot maps


var bidParams=[];

class Bid {
    CPM: number;
    code: string;
    provider: string

    constructor(CPM,code,provider) {
        this.CPM=CPM;
        this.code=code;
        this.provider=provider;
    }
}

class Adapter {

    auctionID: string;
    CPM : number;   //comes from bidding api
    noBid :  boolean;
    code : string;  //comes from bidding api
    EPC : number;
    provider: string;;
    floorPrice: number;
    size : string;

    constructor(auctionID,noBid,EPC,size,provider,floorPrice) {
        this.auctionID=auctionID;
        this.noBid=noBid;
        this.EPC=EPC;
        this.size=size;
        this.provider=provider;
        this.floorPrice=floorPrice;
    }
}

function createBid(adapter) {
//create a bid object
    return new Bid(adapter.CPM,adapter.code,adapter.provider);
}

function getBid(currentAdapter,len)  {
    //get bids
     // construct an HTTP request
    bidParams.push(currentAdapter);
    if (bidParams.length==len) {
        //now we can make a call for bids
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/getBid' , true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        // send the collected data as JSON
        xhr.send(JSON.stringify(bidParams));

        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            let bidResponse=JSON.parse(this.responseText);
            if (bidResponse.length==len) {
                console.log("all bids received",bidResponse);
                for (let adapter of bidResponse) {
                    let relevantAuction=adapter.auctionID;
                    if (adapter.noBid==false) {   //if adapter received a valid bid then create a bid object
                        let newBid=createBid(adapter);
                        registeredAuctions[relevantAuction].addBids(newBid);   //calling addBids of relevant auction
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

 function createAdapter(auctionObj)
 {  
    console.log("current",auctionObj)   //has slot details
    for (let mapObject of config.AdslotProvidersMap) {  //looping through providers map for a particular publisher
        

        //only create adapter if slot matches the slot put up for auction
        if (mapObject['slotID']==auctionObj['slotID']) {
            let currentProv=providerIDMap[mapObject['providerID']]; //publisher, provider

            let currentAdapter = new Adapter(auctionObj.auctionID,true,mapObject['slotID'],auctionObj['slotSize'],currentProv,mapObject['FloorPrice']);
             
            // console.log("currentAdapter",currentAdapter);
            getBid(currentAdapter,config.AdslotProvidersMap.length); //getting bids
        }
 }

}



