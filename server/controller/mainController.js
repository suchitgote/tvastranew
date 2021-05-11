

var models = require('../model/model');
const axios = require('axios');
const { reset } = require('nodemon');



const emaillogin = (req, res) => {
    if (req.session.error_message) {
        message = req.session.error_message
        delete req.session.error_message
        res.render("email_login", data = { err: message, user: false });
    } else if (req.session.succ_message) {
        succ_message = req.session.succ_message;
        delete req.session.succ_message;
        res.render("email_login", data = { succ: succ_message, user: false });
    } else {
        res.render("email_login", data = { user: false })
    }
}

const signup = (req, res) => {
    res.render("signup", data = { user: false });
}

const show_user = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;
        models.user_schema.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id " + id })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Erro retrieving user with id " + id })
            })
    } else {
        models.user_schema.find()
            .then(user => {
                res.render("show_user",data= {users :user })
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Error Occurred while retriving user information" })
            })
    }

}
 
const home = (req,res)=>{
    if(req.session.message && req.session.userid.count==0){
        req.session.userid.count = 1;
        res.render("index",data = {succ: req.session.message.success , user: req.session.userid.user});
    }
    else
        res.render("index",data = {succ: null,user:req.session.userid.user});
}

const otp = (req, res) => {
    if(req.session.otp_err){
        var otp_error = req.session.otp_err ;
        delete req.session.otp_err ;
        res.render("otp" ,data = {err : otp_error ,user :false});
    } else if (req.session.otp_succ){
        var otp_succ = req.session.otp_succ ;
        delete req.session.otp_succ ;
        res.render("otp" ,data = {succ : otp_succ ,user :false});
    } else {
        res.render("otp" ,data = {succ : false , user :false });
    }
}

const create_password = (req, res) => {
    if( req.session.password_error ){
        res.render('create_password' ,data = { err: req.session.password_error ,user: false });
    }
    res.render('create_password' ,data = { err : false , user: false});
}

const phone_login = (req,res)=>{
    if(req.session.phone_err){
        var phone_error = req.session.phone_err ;
        delete req.session.phone_err ;
        res.render("phone_login", data = { err: phone_error , user : false})
    }
    res.render("phone_login" ,data = { err:false , user : false})

}

const doctor = (req,res)=>{
    res.render("doctor", data = { user: false });
}

const hospital = (req,res)=>{
    res.render("hospital", data = { user: false });
}

const about_us = (req,res)=>{
    res.render("about_us", data = { user: false });
}

const profile = (req,res)=>{
    // var record = req.session.record ;
    // delete req.session.record ;
    // console.log("..............................................record = req.session.record .",record)
    
    if(req.session.update_profile){
        console.log("...........................,req.session.update_profile...",req.session.update_profile)
        var update_profile = req.session.update_profile;
        if(update_profile ==  req.session.update_profile){
            delete req.session.update_profile ;
            res.render("profile", data = { user: req.session.update_data ,succ : update_profile }); // ,record: record
        }
    }else{
        if(req.session.update_data){
            res.render("profile", data = { user: req.session.update_data  }); //, record: record
        }else{
            res. render("profile", data = { user: req.session.userid.user }); //, record: record
        }
    }
}

const medical_report = (req,res)=>{
    var record = req.session.record ;
    delete req.session.record ;
    if(req.session.update_data){
        res.render("medical_report", data = { user: req.session.update_data , record: record });
    }else{
        res. render("medical_report", data = { user: req.session.userid.user , record: record });
    }
    
}

const appointment = (req,res)=>{
    if(req.session.update_data){
        res.render("appointment", data = { user: req.session.update_data  });
    }else{
        res. render("appointment", data = { user: req.session.userid.user  });
    }
}

const setting = (req,res)=>{
    if(req.session.update_data){
        res.render("setting", data = { user: req.session.update_data  });
    }else{
        res. render("setting", data = { user: req.session.userid.user  });
    }
}

const show_record = (req,res)=>{

    var sec_var = req.session.record_responce ;
    delete req.session.record_responce ;

   // console.log(".................................................sec_var=",sec_var) ;
 //   console.log(".............................................array....sec_var.file=",sec_var.file) ;


    if(req.session.update_data){
        res.render("show_record", data = { user: req.session.update_data  });
    }else{
        res.render("show_record", data = { user: req.session.userid.user , record_photos: sec_var.file });
    }
}

const tags = (req,res)=>{
    if(req.session.tag_value){
        var sec_tag = req.session.tag_value ;
        delete req.session.tag_value; 
        res.render("tags",tagss = {tag : sec_tag} )   
    }else{
        res.render("tags",tagss = false)   
    }
}

module.exports = {

    emaillogin: emaillogin,
    signup: signup,
    show_user: show_user,
    home:home,
    otp: otp,
    create_password:create_password,
    phone_login:phone_login,
    doctor:doctor,
    hospital:hospital,
    about_us:about_us,
    profile:profile,
    appointment:appointment,
    medical_report:medical_report,
    setting:setting,
    show_record:show_record,
    tags:tags

}




