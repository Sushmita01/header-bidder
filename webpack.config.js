const path = require('path');

module.exports = {
    entry: './headerBidder.js',
    output: {
      filename: 'minified.js',
      path: path.resolve(__dirname, 'public/javascripts')
    }
}