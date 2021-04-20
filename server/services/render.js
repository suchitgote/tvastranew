const axios = require('axios');

var is_login = true ;
exports.index = (req, res) => {
    if(is_login == false){
        console.log("login first")
        res.render('email_login')
    }else{
        res.render('index',{ password_correct : req.flash('password_correct') });
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
    res.render('email_login',{ messages : req.flash('password_wrong') } );
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

exports.demo_postdata = (req, res) => {
    res.render('demo_postdata');
}



//get user data and pass to demo_getdata page.................................
exports.demo_getdata = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://localhost:3000/api/users')
        .then(function(response){
           // console.log(response.data)
            res.render('demo_getdata', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })
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
