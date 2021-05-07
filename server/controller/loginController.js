const axios = require('axios');

var models = require('../model/model');

const OtpManager = require("../../otp/OtpManager");
const otpRepository = require("../../otp/otpRepository");
const otpSender = require("../../otp/otpSender");
const { response } = require('express');
const otpManager = new OtpManager(otpRepository, { otpLength: 4, validityTime: 5 });


const checkMainLogin = (req, res) => {
    if (req.session.userid) {
        res.redirect("/home");
    }else {
         res.redirect("/emaillogin")
    }
}

const checkpreLogin = (req, res, next) => {
    if (req.session.userid) {
        res.redirect("/home");
    }else {
        next();
    }
}
 
const checkLogin = (req, res, next) => {
    if (req.session.userid) {
        console.log("check");
        next();
    } else {
        req.session.error_message = "Login To Access";
        return res.redirect("/emaillogin")
    }
}

const signup = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    // create new user
    const user = new models.user_schema({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        gender : req.body.gender,
        data : req.body.data,
        number : req.body.number,
        city : req.body.city,
        state : req.body.state,
        country : req.body.country,
        doctor : req.body.doctor
    })
    // save user in the database
    user
        .save(user)
        .then(data => {
          res.redirect('../show_user')
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });
}

const emaillogin =  (req, res) => {
    if (req.body.email && req.body.password) {
        models.user_schema.findOne({ email: req.body.email })
        .then(user => {
           // console.log(user)
                if (user.password == req.body.password) {
                    req.session.userid = { user: user, count: 0 };
                    req.session.message = { success: { head: "Success", body: "You have successfully logged in." } };
                    // console.log(req.session.userid)
                    res.redirect("/home");
                } else {
                    req.session.error_message = "Wrong Password"
                    res.redirect("/emaillogin");
                }
        })
        .catch(err => {
            console.log("enter valid Username")
            req.session.error_message = "enter valid Username"
            res.redirect("/emaillogin");
        })
    }else {
        req.session.error_message = "enter All values";
        res.redirect("/emaillogin");
    }
}

const logout = (req, res) => {
    if (req.session.userid) {
        delete req.session.userid;
    }
    res.redirect("/emaillogin")
}

const forgot_password = (req, res)=>{
    models.user_schema.findOne({"email":req.body.email})
    .then(user => {
        console.log(user.email);  
        console.log(user.number);  
        req.session.number  = user.number;

       axios.post(`http://localhost:3000/otp/${req.session.number}`)
       .then(function(response){
          console.log(response.data)
          req.session.otp_succ = "valid only for 60sec" ;
          res.redirect('../otp');
       })
       .catch(err =>{
           res.send(err);
       })
    })
    .catch(err => {
        req.session.error_message = "enter valid Username";
        res.redirect("/emaillogin")
    })
}

const otp_create = (req,res) => {
    const otp = otpManager.create(req.params.token);
    otpSender.send(otp, req.body);
     res.sendStatus(201);
}

const otp_send =(req, res)=> {
    console.log("..........................................post otp_send")

    var otp_number = req.body.input1 + req.body.input2 + req.body.input3 + req.body.input4 ;
    var mobile_number = req.session.number ;
    console.log(".......................................mobile_number = ",`${mobile_number}`)
    console.log(".......................................otp_number = ",`${otp_number}`)

    axios.get(`http://localhost:3000/otp/${mobile_number}/${otp_number}`)
    .then(response => {
        console.log(" .............................post..otp_send then() ")
        console.log("..............................otp verified working = ",response.data)
         if(req.session.phone_login == "true"){
        console.log(" .............................post..otp_send then() if() ")

            delete req.session.phone_login ;
            req.session.message = { success: { head: "Success", body: "You have successfully logged in." } };
            res.redirect('/home');
         }else{
        console.log(" .............................post..otp_send then() else{} ")

             res.redirect('/create_password');
         }
    })
    .catch(err => {
        console.log(" ...............................otp_send catch() ")
        console.log("..............................err.response.status:", err.response.status)

        if( 404 == err.response.status ){
            req.session.otp_err = "enter correct otp"
            res.redirect('/otp');
        }
        if( 409 == err.response.status ){
            req.session.otp_err = "The code has already been verified";
            res.redirect('/otp');
        }
        if( 410 == err.response.status ){
            req.session.otp_err = "The code is expired";
            res.redirect('/otp');
        }
        res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
    })
}

const otp_verifi = (req, res) => {
        const verificationResults = otpManager.VerificationResults;
        const verificationResult = otpManager.verify(req.params.token, req.params.code);
        let statusCode;
        let bodyMessage;
    
        switch (verificationResult) {
            case verificationResults.valid:
                statusCode = 200;
                bodyMessage = "OK";
                break;
            case verificationResults.notValid:
                statusCode = 404;
                bodyMessage = "Not found";
                break;
            case verificationResults.checked:
                statusCode = 409;
                bodyMessage = "The code has already been verified";
                break;
            case verificationResults.expired:
                statusCode = 410;
                bodyMessage = "The code is expired";
                break;
            default:
                statusCode = 404;
                bodyMessage = "The code is invalid for unknown reason";
        }
        res.status(statusCode).send(bodyMessage);
}

const create_password = (req,res)=>{
    var password = req.body.password ;
    var confirm_password = req.body.confirm_password ;
    console.log("password = ",password)
    console.log("confirm_password = ",confirm_password)

    if(  req.body.password == req.body.confirm_password ){
        var number = req.session.number ;
            delete req.session.number ;
            if(number){
                models.user_schema.updateOne( {'number' : number}, {$set:{"password" : password }}  )
                    .then(user => {
                        console.log("updata succsesful")
                        req.session.succ_message = "password update successfuly"
                        res.redirect("/emaillogin");
                    })
                    .catch(err => {
                        res.status(500).send({ message : err.message || "Error Occurred while retriving user information for update" })
                    })

            }else{
                console.log("password is not updated");
                req.session.error_message = "password is not updated" ;
                res.redirect("/emaillogin")
            }
    }else{
        req.session.password_error = "confirm_password is wrong" ;
        res.redirect("/create_password")
    }
}

const phone_login = (req,res)=>{
    models.user_schema.findOne({"number":req.body.number})
     .then(user =>{
         req.session.userid = { user: user, count: 0 };
         axios.post(`http://localhost:3000/otp/${user.number}`)
         .then(response =>{
             console.log("...........................................req.body.number", req.body.number)
             console.log("............................................post phone_login then()  then() ")

             req.session.number = req.body.number ;
             req.session.phone_login = "true" ;

             console.log("...........................................req.session.number =",req.session.number)
             console.log("...........................................req.session.phone_login =",req.session.phone_login)
             req.session.otp_succ = "valid only for 60sec" ;
             res.redirect('../otp');
         })
         .catch(err =>{
             res.send(err);
         })
     })
     .catch((err)=>{
         req.session.phone_err = "pls enter correct number"
         res.redirect("/phone_login")
     })                       

}

const resend_otp = (req,res) => {
    axios.post(`http://localhost:3000/otp/${req.session.number}`)
    .then(response =>{
        req.session.otp_succ = "valid only for 60sec" ;
        res.redirect('../otp');
    })
    .catch(err =>{
        res.send(err);
    })
}

const update_profile = (req,res) => {
    var number = req.session.userid.user.number ;
    console.log("req.session.userid.user.file = ",req.session.userid.user.file)
    console.log("req.file = ",req.file)
    if(!req.file){
        if(req.session.update_data){
            x = req.session.update_data.file
        }else{
            var x = req.session.userid.user.file ;
        }
    }
    else{
        var x = req.file.filename ;
    }

    if(number){
        models.user_schema.updateOne( {'number' : number}, 
        {$set:{
            "name" : req.body.name ,
            "number" : req.body.number ,
            "email" : req.body.email ,
            "gender" : req.body.gender ,
            "data" : req.body.date ,
            "timezon" : req.body.timezon ,
            "house_no" : req.body.house_no ,
            "colony" : req.body.colony ,
            "city" : req.body.city ,
            "state" : req.body.state ,
            "country" : req.body.country,
            "file":  x
        }}  )
            .then(user => {
                console.log("profile updata succsesful")
                req.session.update_profile = "profile update successfuly" ;

                models.user_schema.findOne({ number : number})
                .then(user=>{
                req.session.update_data = user;
                console.log(".....................req.session.update_data",req.session.update_data)
                console.log(".....................req.session.update_data.country",req.session.update_data.country)
 
                    res.redirect("/profile");
                })
                .catch(err=>{
                    res.redirect("/home");
                })
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information for update" })
            })
    }else{
        console.log("profile is not updated");
        req.session.error_message = "profile is not updated" ;
        res.redirect("/emaillogin")
    }
}

const medical_record = (req,res)=>{
        console.log(".....................................................................req.files",req.files)
        const medical_records = new models.medical_record({
            file : req.files,
            title : req.body.title,
            name : req.body.name,
            date : req.body.date,
            number : req.body.number,
            record_type : req.body.record_type
        })
        medical_records
            .save(medical_records)
            .then(data => {
                console.log("................................................new uploaded..medical_record",data)
                res.redirect("/profile");
            }) 
            .catch(err =>{
                res.status(500).send({
                    message : err.message || "Some error occurred while creating a create operation"
                });
            });
}

const profile = (req,res,next)=>{

                if(req.session.update_data){
                  var  y = req.session.update_data.number
                }else{
                  var  y = req.session.userid.user.number ;
                }

              models.medical_record.find({ number: y })
              .then(user => {
                    console.log("..............................................medical_records of login_user",user)
                    req.session.record = user;
                    next();
              })
              .catch(err => {
                   res.redirect("/emaillogin");
              })
}

const delete_record = (req,res)=>{
    var uid = req.body.uid;
    console.log("........................................uid",uid);
    models.medical_record.remove({ "_id": uid })
    .then(user => {
          console.log("..............................................user",user)
          res.redirect("/profile");
    })
    .catch(err => {
        console.log("..............................................err",err)
         res.redirect("/emaillogin");
    })

}


module.exports = {
    
    checkMainLogin : checkMainLogin,
    checkpreLogin : checkpreLogin ,
    checkLogin : checkLogin,
    signup : signup,
    emaillogin : emaillogin,
    logout : logout,
    forgot_password: forgot_password,
    otp_create: otp_create,
    otp_send : otp_send,
    otp_verifi: otp_verifi,
    create_password,create_password,
    phone_login:phone_login,
    resend_otp:resend_otp,
    update_profile:update_profile,
    medical_record:medical_record,
    profile:profile,
    delete_record:delete_record
 
}





/*

const axios = require('axios');

var is_login = true ;
exports.index = (req, res) => {
    if(req.flash('password_correct') == "login successfull"){
        res.render('index',{ password_correct : req.flash('password_correct') } );
    }
    else{
        res.redirect("/") ;
    }
} 
exports.doctor = (req, res) => {
    res.render('doctor');
}
exports.hospital = (req, res) => {
    res.render('hospital');
}
exports.treatment = (req, res) => {
    res.render('treatment');
}

exports.about_hospital = (req, res) => {
    res.render('about_hospital');
}
exports.about_us = (req, res) => {
    res.render('about_us');
}
exports.book_appointment = (req, res) => {
    res.render('book_appointment');
}
exports.contact = (req, res) => {
    res.render('contact');
}
exports.create_password = (req, res) => {
    res.render('create_password');
}
exports.doctor_profile = (req, res) => {
    res.render('doctor_profile');
}

exports.faq = (req, res) => {
    res.render('faq');
}
exports.login = (req, res) => {
    res.render('login');
}
exports.signup = (req, res) => {
    res.render('signup');
}
exports.otp = (req, res) => {
    res.render('otp');
}
exports.submit_your_query = (req, res) => {
    res.render('submit_your_query');
}
exports.tvastra_plus = (req, res) => {
    res.render('tvastra_plus');
}
exports.phone_login = (req, res) => {
    res.render('phone_login');
}


//get user data and pass to demo_getdata page....................................
exports.show_user = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://localhost:3000/api/show_user')
        .then(function(response){
           // console.log(response.data)
            res.render('show_user', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })
}


*/