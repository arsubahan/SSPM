var mongoose = require('mongoose');


var projectSchema = mongoose.Schema({

    projtrnsno: {
        type: String,
        unique: true
    },

    projclient: {
        type: String,
    },

    proptitle: {
        type: String
    },

    projproblemtype: {
        type: String
    },

    projproptype: {
        type: String
    },
    projremarks: {
        type: String
    },

    propduration: {
        type: String
    },

    projpropsdatest: {
        type: String
    }, // P - for proposal   A - for contract  c-Close
    projpropsdatend: {
        type: String
    }


})

var projectdb = mongoose.model('flprojectmongos', projectSchema);
module.exports = projectdb;;