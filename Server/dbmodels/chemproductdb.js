var mongoose = require('mongoose');


var chemproductSchema = mongoose.Schema({

    chempcode: {
        type: String,
        unique: true
    },

    chempname: {
        type: String
    },
    chempacting: {
        type: String
    },
    chempdesc: {
        type: String
    },
    chempuom: {
        type: String
    },

    chempinstock: {
        type: Number
    },

    chempcost: {
        type: Number
    },
    chempusein : {
        type: String
    }
})

var chemproductdb = mongoose.model('flchemproductmongos', chemproductSchema);
module.exports = chemproductdb;;