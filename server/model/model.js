const mongoose = require('mongoose');

//scheme for demo table....
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
        required:true,
        unique: true
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
    doctor:String,
    timezon :{
        type: String
    },
    house_no :{
        type: String
    },
    colony :{
        type: String
    },
    yourself :{
        type: String
    },
    file :{
        type: String
    },
    achivement :{
        type: String
    },
    hospital :{
        type: String
    },
    experience :{
        type: String
    },
    qualification :{
        type: String
    },
    awards :{
        type: String
    },
    specification :{
        type: String
    },
    fees :{
        type: String
    },
    yourself :{
        type: String
    },
    schedule :[],
    slots:[]
})
 
//scheme for medical_records table....
var medical_records = new mongoose.Schema({
    file :[],    
    title :{
        type: String,
        required:true
    },    
    name :{
        type: String,
        required:true
    },
    date :{
        type: String,
        required:true
    },
    number :{
        type: String,
        required:true
    },      
    record_type :{
        type: String,
        required:true
    }
});

const Userdb = mongoose.model('userdbcol', schema);

const user_schema_table = mongoose.model('users',user_schema) ;

const medical_record = mongoose.model('medical_record',medical_records) ;


module.exports = {
    Userdb : Userdb,
    user_schema :user_schema_table,
    medical_record :medical_record
}