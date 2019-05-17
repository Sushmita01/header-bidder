// Hello from adapterManager.js
// I make adapter objects from provider-adslot maps

import * as auctionManager from './auctionManager';
import * as logger from './logger';

var bidParams=[];
var adapters=[];



class Bid {
    CPM: number;
    code: string;
    EPC: number;
    provider: string

    constructor(CPM,code,EPC,provider) {
        this.CPM=CPM;
        this.code=code;
        this.EPC=EPC;
        this.provider=provider;
    }
}

class Adapter {

    auctionID: string;
    CPM : number;   //comes from bidding api
    noBid :  boolean;
    code : string;  //comes from bidding api
    EPC : number;
    slotID: number;
    providerID: string;
    floorPrice: number;
    revenueShare: number;
    size : string;
    getBid = function () {
        let bidParam={slotID: this.slotID, EPC: this.EPC, providerID: this.providerID, floorPrice: this.floorPrice,size:this.size};
        return makeBidRequest(bidParam);
         
    }

    constructor(auctionID,noBid,slotID,EPC,size,providerID,floorPrice) {
        this.auctionID=auctionID;
        this.noBid=noBid;
        this.slotID=slotID;
        this.EPC=EPC;
        this.size=size;
        this.providerID=providerID;
        this.floorPrice=floorPrice;
    }
}

function createBid(adapter) {
//create a bid object
    return new Bid(adapter.CPM,adapter.code,adapter.EPC,adapter.providerID);
}

function makeBidRequest(bidParam)  {
    bidParams.push(bidParam);
    return new Promise(function(resolve, reject) {
        // Do async job
           

        if (bidParams.length==config.AdslotProvidersMap.length) {
        //now we can make a call for bids
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/getBid' , true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.timeout = 300; 

        // send the collected data as JSON
        xhr.send(JSON.stringify(bidParams));

        xhr.ontimeout = function (e) {
            console.log('No bids received.Could not complete in 300ms');
          };
          

        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                
            let bidResponse=JSON.parse(this.responseText);
            if (bidResponse.length==config.AdslotProvidersMap.length) {
                console.log("all bids received",bidResponse);
-
                resolve(bidResponse);

            }
            }
        };
    }
    })
    
    

}


export function createAdapter(auctionObj)
 {  
    console.log("current",auctionObj)   //has slot details
    return new Promise(function(resolve, reject) {
        // Do async job
        for (let mapObject of config.AdslotProvidersMap) {  //looping through providers map for a particular publisher
            

            //only create adapter if slot matches the slot put up for auction
            if (mapObject['slotID']==auctionObj['slotID']) { 

                let currentAdapter = new Adapter(auctionObj.auctionID,true,mapObject['slotID'],mapObject['ExternalPlacementID'],auctionObj['slotSize'],mapObject['providerID'],mapObject['FloorPrice']);
                adapters.push(currentAdapter);

                let bidPromise=currentAdapter.getBid(); //getting bids

                bidPromise.then((data)=> {
                    logger.logProviderResponse(data)
                    for(let ad of adapters) {
                        for(let bid of data) {
                            if (ad.providerID==bid.providerID && ad.slotID==bid.slotID) {
                                let relevantAuction=ad.auctionID;
                                // ad.noBid==false                  //if adapter received a valid bid then create a bid object
                                let newBid=createBid(bid);
                                auctionManager.registeredAuctions[relevantAuction].addBids(newBid);   //calling addBids of relevant auction

                            }
                        }
                    }
                    logger.logAuctionParticipant(auctionManager.registeredAuctions)
                    resolve(true);
                    // 
                })
            }
        }
    });

}



