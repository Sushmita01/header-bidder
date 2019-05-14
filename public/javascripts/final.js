var config={publisherDetails:[{"ID":345,"Name":"Recipe.com","isActive":1}],adslots: [{"publisher_id":345,"slot_id":617934,"divID":"adslot2","dimension":"300x200","slot_name":"bottom"},{"publisher_id":345,"slot_id":638257,"divID":"adslot1","dimension":"400x200","slot_name":"middle"}],providers: [{"ID":"OX3845","Name":"OpenX","EntryPoint":"getBid"},{"ID":"AP8875","Name":"AppNexus","EntryPoint":"getBid"},{"ID":"MD5697","Name":"Media.net","EntryPoint":"getBid"},{"ID":"PI7654","Name":"Platform.io","EntryPoint":"getBid"}],AdslotProvidersMap:[{"slotID":617934,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":0.2,"FloorPrice":2,"providerID":"OX3845"},{"slotID":617934,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":0.3,"FloorPrice":2,"providerID":"AP8875"},{"slotID":617934,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":0.2,"FloorPrice":2,"providerID":"MD5697"},{"slotID":617934,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":0.1,"FloorPrice":2,"providerID":"PI7654"},{"slotID":638257,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":0.1,"FloorPrice":3,"providerID":"PI7654"},{"slotID":638257,"ExternalPublisherID":345,"ExternalPlacementID":null,"RevenueShare":0.2,"FloorPrice":3,"providerID":"MD5697"}]};!function(t){var e={};function n(o){if(e[o])return e[o].exports;var i=e[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(o,i,function(e){return t[e]}.bind(null,i));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=2)}([function(t,e,n){"use strict";e.__esModule=!0,e.registeredAuctions={};var o=function(){return function(t,e){this.bids=[],this.registerAuction=function(){this.auctionID="A"+this.slotID.toString()},this.closeAuction=function(){console.log("closing auction.."),this.status=!0},this.getWinner=function(){for(var t,e=0,n=0,o=this.bids;n<o.length;n++){var i=o[n];i.CPM>e&&(t=i,e=i.CPM)}this.winner=t},this.getStatus=function(){return console.log("auction",this.auctionID,"is",this.status?"Closed":"Active"),this.status},this.addBids=function(t){this.bids.push(t)},this.slotID=t,this.slotSize=e,this.status=!1}}();e.Auction=o,e.closeAuctions=function(){for(var t in e.registeredAuctions)e.registeredAuctions[t].closeAuction(),e.registeredAuctions[t].getWinner(),console.log(e.registeredAuctions[t])}},function(t,e,n){"use strict";e.__esModule=!0;var o={providerResponses:null,auctionParticipants:null,auctionWinner:null};e.logProviderResponse=function(t){o.providerResponses=t},e.logAuctionParticipant=function(t){var e={};for(var n in t)e[n]=t[n].bids;o.auctionParticipants=e},e.logAuctionWinner=function(t){var e={};for(var n in t)e[n]={provider:t[n].winner.provider,CPM:t[n].winner.CPM};o.auctionWinner=e},e.postLog=function(){var t=new XMLHttpRequest;t.open("POST","http://localhost:3000/log",!0),t.setRequestHeader("Content-Type","application/json; charset=UTF-8"),t.send(JSON.stringify(o)),t.onreadystatechange=function(){4==this.readyState&&200==this.status&&console.log("Logs fired!")}}},function(t,e,n){"use strict";e.__esModule=!0;for(var o=n(0),i=n(3),r=n(1),s={},c=0,u=config.adslots;c<u.length;c++){var a=(A=u[c]).divID;s.hasOwnProperty(a)||(s[a]=A.slot_id)}for(var l={},d=0,f=config.providers;d<f.length;d++){var h=f[d],g=h.ID;l.hasOwnProperty(g)||(l[g]=h.Name)}window.hbShow=function(t){var e=document.getElementById(t),n=document.createElement("iframe");e.appendChild(n);var i="A"+s[t],r=o.registeredAuctions[i],c=r.winner.code.toString();!function(t){for(var e in l)-1!=t.indexOf(e)&&(t=t.replace(e,l[e]))}(c);var u=r.slotSize.split("x")[1];n.setAttribute("height",u),n.setAttribute("srcdoc",c),console.log(e,"got rendered!")};for(var p=0,v=config.adslots;p<v.length;p++){var A=v[p],P=new o.Auction(A.slot_id,A.dimension);P.registerAuction(),o.registeredAuctions[P.auctionID]=P,i.createAdapter(P).then(function(){o.closeAuctions(),r.logAuctionWinner(o.registeredAuctions),r.postLog()})}},function(t,e,n){"use strict";e.__esModule=!0;var o=n(0),i=n(1),r=[],s=[],c=function(){return function(t,e,n){this.CPM=t,this.code=e,this.provider=n}}(),u=function(){return function(t,e,n,o,i,s){this.getBid=function(){return function(t){return r.push(t),new Promise(function(t,e){if(r.length==config.AdslotProvidersMap.length){var n=new XMLHttpRequest;n.open("POST","http://localhost:3000/getBid",!0),n.setRequestHeader("Content-Type","application/json; charset=UTF-8"),n.timeout=300,n.send(JSON.stringify(r)),n.ontimeout=function(t){console.log("No bids received.Could not complete in 300ms")},n.onreadystatechange=function(){if(4==this.readyState&&200==this.status){var e=JSON.parse(this.responseText);e.length==config.AdslotProvidersMap.length&&(console.log("all bids received",e),t(e))}}}})}({slotID:this.slotID,providerID:this.providerID,floorPrice:this.floorPrice,size:this.size})},this.auctionID=t,this.noBid=e,this.slotID=n,this.size=o,this.providerID=i,this.floorPrice=s}}();e.createAdapter=function(t){return console.log("current",t),new Promise(function(e,n){for(var r=0,a=config.AdslotProvidersMap;r<a.length;r++){var l=a[r];if(l.slotID==t.slotID){var d=new u(t.auctionID,!0,l.slotID,t.slotSize,l.providerID,l.FloorPrice);s.push(d),d.getBid().then(function(t){for(var n=0,r=s;n<r.length;n++)for(var u=r[n],a=0,l=t;a<l.length;a++){var d=l[a];if(u.providerID==d.providerID&&u.slotID==d.slotID){var f=u.auctionID,h=new c((g=d).CPM,g.code,g.providerID);o.registeredAuctions[f].addBids(h)}}var g;i.logAuctionParticipant(o.registeredAuctions),e(!0)})}}})}}]);