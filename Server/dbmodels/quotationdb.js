var mongoose = require('mongoose');


var quotationSchema = mongoose.Schema({

    quotrnsno: {
        type: String
    },

    quoenqno: {
        type: String
    },

    quoseq: {
        type: String
    },

    quodesc: {
        type: String
    },

    quofrequency: {
        type: String
    },

    quoamount: {
        type: String
    },
    quodate: {
        type: Date
    }
    
})

var quotationdb = mongoose.model('flquotationmongos', quotationSchema);
module.exports = quotationdb;