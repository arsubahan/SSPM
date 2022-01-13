var mongoose = require('mongoose');

var scheduleSchema = mongoose.Schema({

    schtrnsno: {
        type: String,
        unique: true
    },

    schprojno: {
        type: String
    },

    schdesc: {
        type: String
    },

    schprodreq: {
        type: String
    },

    schproduse: {
        type: String
    },
    schdatest: {
        type: Date
    },
    schcompldate: {
        type: Date
    },
    schpersonnel: {
        type: String
    },
    schaction: {
        type: String
    },

    schrptdt: {
        type: String
    },

    schrptby : {
        type: String
    }
    
})

var scheduledb = mongoose.model('flschedulemongos', scheduleSchema);
module.exports = scheduledb;;