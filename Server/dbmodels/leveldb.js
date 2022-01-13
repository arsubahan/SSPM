var mongoose = require('mongoose');

// User Schema

var levelSchema = mongoose.Schema({

    levelcd: {
        type: String,
        unique: true
    },

    Desc: {
        type: String
    },
    
})

var leveldb = mongoose.model('fllevelmongos', levelSchema);
module.exports = leveldb;