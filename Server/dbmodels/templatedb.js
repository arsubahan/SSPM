var mongoose = require('mongoose');

// User Schema

var templateSchema = mongoose.Schema({

   templatedocd: {
        type: String,
        unique: true
    },

    templatename: {
        type: String
    },

    UStemplateDesc: {
        type: String
    },

    
})

var templatedb = mongoose.model('fltemplatemongos', templateSchema);
module.exports = templatedb;;