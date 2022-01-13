var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema

var StaffSchema = mongoose.Schema({

    UsStaffcd: {
        type: String,
        unique: true
    },

    UsStaffname: {
        type: String
    },

    USStaffAddress: {
        type: String
    },

    UsDesignation: {
        type: String
    },

    UsHphone: {
        type: String
    },

    Usemail: {
        type: String
    },

    Uslevel: {
        type: String
    },
    
    UsPassword: {
        type: String
    },

    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
})


StaffSchema.methods.encryptPassword = function (password) {
    console.log('encryoted  for amdmin');
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}
StaffSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.UsPassword);
};


var Staffdb = mongoose.model('flStaffmongos', StaffSchema);
module.exports = Staffdb;;