const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    doctor : String
})

//scheme for users table....
var user_schema = new mongoose.Schema({
    name :{
        type: String,
        required:true
    },
    email :{
        type: String,
        required:true,
        unique: true
    },
    password :{
        type: String,
        required:true
    },
    gender :{
        type: String,
        required:true
    },
    data :{
        type: String,
        required:true
    },
    number :{
        type: String,
        required:true
    },
    city :{
        type: String,
        required:true
    },
    state :{
        type: String,
        required:true
    },
    country :{
        type: String,
        required:true
    },
    doctor:String
    
})

const Userdb = mongoose.model('userdbcol', schema);

const user_schema_table = mongoose.model('users',user_schema) 




module.exports = {
    Userdb : Userdb,
    user_schema :user_schema_table
}