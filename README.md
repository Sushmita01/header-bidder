# header-bidder

## What's header bidding?

Digital advertising, despite the massive industry built to streamline it, is still plagued by inefficiency and fragmentation. Programmatic selling may mean automation in theory, but it still requires plenty of behind-the-scenes work to connect the buyers to the sellers.

Born out of this reality are techniques such as header bidding, one of the many ways publishers are trying to eke more revenue out of their ad inventory. 

Header bidding, also known as advance bidding or pre-bidding, is an advanced programmatic technique wherein publishers offer inventory to multiple ad exchanges simultaneously before making calls to their ad servers. The idea is that by letting multiple demand sources bid on the same inventory at the same time, publishers increase their yield and make more money.

## Project details

This is a POC for a Header Bidder component. It has all the usual components in play -
* An ad exchange
* A group of publishers
* A header bidder JS code that is loaded on page load
* A real time bidding that happens within 300 ms of page load
* A declared winner for the adslot

For more info on how header bidding works check [this](https://digiday.com/media/wtf-header-bidding/#:~:text=Header%20bidding%2C%20also%20known%20as,(mostly%20DoubleClick%20for%20Publishers)) out.

For a very popular industry standard header bidder, you can check [Prebid.js](https://prebid.org/product-suite/prebid-js/)
