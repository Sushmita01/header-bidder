# header-bidder

## What's header bidding?

Header bidding, also known as advance bidding or pre-bidding, is an advanced programmatic technique wherein publishers offer inventory to multiple ad exchanges simultaneously before making calls to their ad servers (mostly DoubleClick for Publishers). The idea is that by letting multiple demand sources bid on the same inventory at the same time, publishers increase their yield and make more money.

## Project details

This is a POC for a Header Bidder component. It has all the usual components in play -
* An ad exchange
* A group of publishers
* A header bidder JS code that is loaded on page load
* A real time bidding that happens within 300 ms of page load
* A declared winner for the adslot

For more info on how header bidding works check [this](https://digiday.com/media/wtf-header-bidding/#:~:text=Header%20bidding%2C%20also%20known%20as,(mostly%20DoubleClick%20for%20Publishers)) out.

For a very popular industry standard header bidder, you can check [Prebid.js](https://prebid.org/product-suite/prebid-js/)
