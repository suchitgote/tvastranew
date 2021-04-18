const express = require('express');
const route = express.Router()

const services = require('../services/render');
const controller = require('../controller/controller');


  route.get('/', services.index);
  route.get('/doctor',  services.doctor)
  route.get('/hospital',  services.hospital)
  route.get('/treatment', services.treatment )
  route.get('/about_hospital', services.about_hospital )

  route.get('/about_us', services.about_us )
  route.get('/book_appointment', services.book_appointment )
  route.get('/contact', services.contact )
  route.get('/create_password', services.create_password )
  route.get('/doctor_profile', services.doctor_profile )

  route.get('/email_login', services.email_login )
  route.get('/faq', services.faq )
  route.get('/login', services.login )
  route.get('/signup', services.signup )
  route.get('/otp', services.otp )

  route.get('/submit_your_query', services.submit_your_query )
  route.get('/tvastra_plus', services.tvastra_plus )
  route.get('/phone_login', services.phone_login )

  route.get('/demo_getdata', services.demo_getdata )
  route.get('/demo_postdata', services.demo_postdata )

  route.get('/show_user', services.show_user )
  //delete_user  


  
// API
route.post('/api/users', controller.create);
route.get('/api/users', controller.find);

route.post('/api/show_user', controller.create_user);
route.get('/api/show_user', controller.show_user);

route.post('/api/email_login', controller.email_login);

///api/email_login
  
module.exports = route ;