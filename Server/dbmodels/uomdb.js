var mongoose = require('mongoose');


// User Schema

var UOMFLSchema = mongoose.Schema({

    UOMCD: {
        type: String,
        unique: true
    },

    UOMDESC: {
        type: String
    },

})



var UOMFLdb = mongoose.model('UOMmongos', UOMFLSchema);
module.exports = UOMFLdb;