// Hello from adapterManager.js
// I make adapter objects from provider-adslot maps

//adapter
var bidParams=[];

class Adapter {
    bidAmount : number;
    noBid :  boolean;
    code : string;
    EPC : number;
    size : string;

    constructor(bidAmount) {
        this.bidAmount=bidAmount;
    }
}

function createAdapter()
 {   
     let providerIDMap={};
     for (let prov of config.providers) {
        if (!(providerIDMap.hasOwnProperty(prov.ID))) {
            providerIDMap[prov.ID]=prov.Name;
        }
     }

     for (let mapObject of config.AdslotProvidersMap) {
        bidParams.push({'slotID':mapObject['slotID'],'providerID':mapObject['providerID'],'floorPrice':mapObject['FloorPrice']});
        console.log(bidParams);
        let currentProv=providerIDMap[mapObject['providerID']];

        let adapterObject = {};
        if (adapters.hasOwnProperty(mapObject.slotID)) {
            adapters[mapObject.slotID][currentProv] = adapterObject;
        }
        else {
            adapters[mapObject.slotID]={};
            adapters[mapObject.slotID][currentProv] = adapterObject;

        }
     }
     console.log(adapters)
     console.log(bidParams);
 }



