var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


var clientSchema = mongoose.Schema({

    clcode: {
        type: String,
        unique: true
    },
    clconame: {
        type: String
    },

    clcontactperson: {
        type: String
    },

    claddress: {
        type: String
    },

    clcontactno: {
        type: String
    },

    clemail: {
        type: String
    },
    clstaff: {
        type: String
    },
    cldatereg: {
        type: String
    },

    clpassword: {
        type: String
    },

    resetPasswordToken : {
        type: String
    }, 
    resetPasswordExpires : {
        type: Date
    }
    

})

clientSchema.methods.encryptPassword = function (password) {
    console.log('encryoted  for client');
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}
clientSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.clpassword);
};

var clientdb = mongoose.model('flclientmongos', clientSchema);
module.exports = clientdb;;
