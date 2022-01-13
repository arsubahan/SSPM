var mongoose = require('mongoose');


var durationSchema = mongoose.Schema({

    durcd: {
        type: String,
        unique: true
    },

    durdesc: {
        type: String
    }

})

var durationdb = mongoose.model('fldurationmongos', durationSchema);
module.exports = durationdb;;