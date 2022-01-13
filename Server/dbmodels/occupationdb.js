var mongoose = require('mongoose');

// User Schema

var occupationSchema = mongoose.Schema({

    occupationcd: {
        type: String,
        unique: true
    },

    occupationDesc: {
        type: String
    },

    
})


var occupationdb = mongoose.model('floccupationmongos', occupationSchema);
module.exports = occupationdb;