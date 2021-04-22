const axios = require('axios');

var models = require('../model/model');

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
            console.log(user)
                if (user.password == req.body.password) {
                    req.session.userid = { user: user, count: 0 };
                    req.session.message = { success: { head: "Success", body: "You have successfully logged in." } };
                    console.log(req.session.userid)
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

module.exports = {
    checkMainLogin : checkMainLogin,
    checkpreLogin : checkpreLogin ,
    checkLogin : checkLogin,
    signup : signup,
    emaillogin:emaillogin
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
exports.email_login = (req, res) => {
    if(req.flash('password_wrong') == "incorrect email or password"){
        res.render('email_login',{ messages : req.flash('password_wrong') } );
    }else{
        req.flash('login_first' , 'pls login first')
        res.render('email_login',{ messages : req.flash('login_first') } );
    }
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