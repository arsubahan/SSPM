var mongoose = require('mongoose');

var clmotionSchema = mongoose.Schema({

    clvcode: {
        type: String,
        unique: true
    },
    clvcamno : {
        type: String
    },
    clvname : {
        type : String
    }

})

var clmotiondb = mongoose.model('flclmotionmongos', clmotionSchema);
module.exports = clmotiondb;;
