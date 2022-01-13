var mongoose = require('mongoose');

var clvideoSchema = mongoose.Schema({

    clcode: {
        type: String,
        unique: true
    },
    clloc : {
        type: String
    },
    clwsport : {
        type : String
    }

})


var clvideodb = mongoose.model('flclvideomongos', clvideoSchema);
module.exports = clvideodb;;
