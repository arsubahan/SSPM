var mongoose = require('mongoose');


var enquireSchema = mongoose.Schema({

    enqtrnsno: {
        type: String,
        unique: true
    },
    projtrnsno: {
        type: String
    },
    enqclientcd: {
        type: String
    },
    enqconame: {
        type: String
    },
    enqcontactperson: {
        type: String
    },

    enqaddress: {
        type: String
    },
    enqpremises: {
        type: String
    },

    enqcontactno: {
        type: String
    },

    enqemail: {
        type: String
    },

    enqproblemtype: {
        type: String
    },
    enqregdate: {
        type: Date
    },

    enqproptype: {
        type: String
    },
    enqremarks: {
        type: String
    },
    proptitle: {
        type: String
    },
    propduration : {
        type: String
    },
    propsolution : {
        type: String
    },
    enqpropstatus : {
        type: String
    }, // P - for proposal   A - for contract  c-Close
    enqpropsdatest : {
        type: String
    }, 
    enqpropsdatend : {
        type: String
    },
    enqpropsdatcompl : {
        type: String
    }


})

var enquiredb = mongoose.model('flenquiremongos', enquireSchema);
module.exports = enquiredb;;