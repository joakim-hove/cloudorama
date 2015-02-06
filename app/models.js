var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
    _id : String,
    items: [{type : String}]
});

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;