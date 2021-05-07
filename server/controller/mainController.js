

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
    var record = req.session.record ;
    delete req.session.record ;
    // console.log("..............................................record = req.session.record .",record)
    
    if(req.session.update_profile){
        console.log("...........................,req.session.update_profile...",req.session.update_profile)
        var update_profile = req.session.update_profile;
        if(update_profile ==  req.session.update_profile){
            delete req.session.update_profile ;
            
            res.render("profile", data = { user: req.session.update_data ,succ : update_profile , record: record});
        }
    }else{
        if(req.session.update_data){
            res.render("profile", data = { user: req.session.update_data , record: record });
        }else{
            res. render("profile", data = { user: req.session.userid.user , record: record});
        }
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
    profile:profile
}



// var models = require('../model/model');
// const axios = require('axios');

// var global ;
// var global_email = "";

// // create_user...........................................................
// exports.create_user = (req,res)=>{
//     // validate request
//     if(!req.body){
//         res.status(400).send({ message : "Content can not be emtpy!"});
//         return;
//     }

//     // create new user
//     const user = new models.user_schema({
//         name : req.body.name,
//         email : req.body.email,
//         password : req.body.password,
//         gender : req.body.gender,
//         data : req.body.data,
//         number : req.body.number,
//         city : req.body.city,
//         state : req.body.state,
//         country : req.body.country,
//         doctor : req.body.doctor
//     })

//     // save user in the database
//     user
//         .save(user)
//         .then(data => {
//           //res.send(data) 
//           res.redirect('../show_user')
//         })
//         .catch(err =>{
//             res.status(500).send({
//                 message : err.message || "Some error occurred while creating a create operation"
//             });
//         });
// }
// // show_user.............................................................
// exports.show_user = (req, res)=>{
//     if(req.query.id){
//         const id = req.query.id;
//         models.user_schema.findById(id)
//             .then(data =>{
//                 if(!data){
//                     res.status(404).send({ message : "Not found user with id "+ id})
//                 }else{
//                     res.send(data)
//                 }
//             })
//             .catch(err =>{
//                 res.status(500).send({ message: "Erro retrieving user with id " + id})
//             })
//     }else{
//         models.user_schema.find()
//             .then(user => {
//                 res.send(user)
//             })
//             .catch(err => {
//                 res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
//             })
//     }


// }
// // email_login...........................................................
// exports.email_login = (req, res)=>{

//  models.user_schema.find({"email":req.body.email})
//     .then(user => {
//         console.log(user[0].email,user[0].password);
//         if(user[0].password == req.body.password ){
//             console.log("password is correct")
//             req.flash('password_correct' , 'login successfull')
//             res.redirect("/index");

//         }else{
//             console.log("password is not correct")
//             req.flash('password_wrong' , 'incorrect email or password')
//             res.redirect("/");
//         }
//     })
//     .catch(err => {
//         res.status(500).send({ message : err.message || "Error Occurred while retriving user information" }) 
//     })
// }

// // forgot_password.....................................................
// exports.forgot_password = (req, res)=>{
//     models.user_schema.find({"email":req.body.email})
//     .then(user => {
//         console.log(user[0].email);  
//         console.log(user[0].number);  
//         var number = user[0].number;

//         global = number;
//         global_email = user[0].email ;

//        axios.post(`http://localhost:3000/otp/${number}`)
//        .then(function(response){
//           console.log(response.data)
//            res.redirect('../otp');
//        })
//        .catch(err =>{
//            res.send(err);
//        })
//     })
//     .catch(err => {
//         res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
//     })
// }

// // otp_send.............................................................
// exports.otp_send =(req, res)=> {

//     var otp_number = req.body.input1 + req.body.input2 + req.body.input3 + req.body.input4 ;
//     console.log(global) ;
//     console.log("otp_number = ",`${otp_number}`)

//     axios.get(`http://localhost:3000/otp/${global}/${otp_number}`)
//     .then((response)=>{
//         console.log("otp get working = ",response.data)
//         if(!(global_email == "")){
//             res.redirect('/create_password');
//         }else{
//             res.redirect('/index');
//         }
//     })
//     .catch(err => {
//         res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
//     })
// }


// // create_password......................................................
// exports.create_password = (req,res)=>{
//     var password = req.body.password ;
//     var confirm_password = req.body.confirm_password ;

//     console.log("password = ",password)
//     models.user_schema.updateOne(
//         {'number' : global},
//         {$set:{"password" : password }}
//         )
//         .then(user => {
//             console.log("updata succsesful")
//             res.redirect("/show_user");
//         })
//         .catch(err => {
//             res.status(500).send({ message : err.message || "Error Occurred while retriving user information for update" })
//         })
// }

// // phone_login.............................................................
// exports.phone_login = (req,res)=>{
//     var phone_number = req.body.number ;
//     console.log("phone_number = ",phone_number)

//     axios.post(`http://localhost:3000/otp/${phone_number}`)
//     .then(function(response){
//        console.log("phone login working....")
//        global = phone_number;
//        console.log("global = phone_number = ",phone_number,global)
//        console.log(response.data)
//         res.redirect('../otp');
//     })
//     .catch(err =>{
//         res.send(err);
//     })
// }

