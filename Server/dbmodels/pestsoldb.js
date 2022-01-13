var mongoose = require('mongoose');


var pestsolutionSchema = mongoose.Schema({

    soltrnsno: {
        type: String,
        unique: true
    },

    solpestcd: {
        type: String
    },

    soldesc: {
        type: String
    }

})

var pestsolutiondb = mongoose.model('flpestsolutionmongos', pestsolutionSchema);
module.exports = pestsolutiondb;;