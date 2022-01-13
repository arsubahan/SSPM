var mongoose = require('mongoose');


var pestcdSchema = mongoose.Schema({

    pestcd: {
        type: String,
        unique: true
    },

    pesttype: {
        type: String
    },

    pestdesc: {
        type: String
    },

    pestremarks: {
        type: String
    }
})

var pestcddb = mongoose.model('flpestcdmongos', pestcdSchema);
module.exports = pestcddb;;