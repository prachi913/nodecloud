const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    phone : {
        type : String,
        required : true
    },
    profile_pic : {
        type : String
    }
});

const USER_MODEL = new mongoose.model('User', usersSchema);

module.exports = {USER_MODEL};