const express = require('express');
const router = express.Router()

const loginController = require("../controller/loginController")
const mainController = require("../controller/mainController")

const path = require('path');
const multer = require('multer');


// multer fo single file
var storage = multer.diskStorage({
    destination: "./assets/uploads/",
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage:storage })


router.route("/").get(loginController.checkMainLogin );

router.route("/emaillogin").get(loginController.checkpreLogin,mainController.emaillogin);
router.route("/emaillogin").post(loginController.emaillogin);

router.route("/doctor").get(loginController.checkLogin,mainController.doctor);

router.route("/demodoc").get(loginController.checkLogin,mainController.demodoc);

router.route("/hospital").get(loginController.checkLogin,mainController.hospital);

router.route("/about_us").get(loginController.checkLogin,mainController.about_us);

router.route("/home").get(loginController.checkLogin,mainController.home);

router.route("/signup").get(mainController.signup);
router.route("/signup").post(upload.single('file'),loginController.signup);

router.route("/show_user").get(mainController.show_user);

router.route("/logout").get(loginController.logout);

router.route("/forgot_password").post(loginController.forgot_password); 

router.route("/otp/:token").post( loginController.otp_create );

router.route("/otp/:token/:code").get( loginController.otp_verifi );

router.route("/otp").get(mainController.otp);
router.route("/otp_send").post(loginController.otp_send);

router.route("/create_password").get(mainController.create_password);
router.route("/create_password").post(loginController.create_password); 

router.route("/phone_login").get(mainController.phone_login);
router.route("/phone_login").post(loginController.phone_login);

router.route("/resend_otp").get(loginController.resend_otp);

router.route("/profile").get( mainController.profile);  // loginController.profile ,
router.route("/update_profile").post(upload.single('file'),loginController.update_profile);

router.route("/delete_record").post(loginController.delete_record);

router.route("/appointment").get(mainController.appointment);

router.route("/medical_report").get(loginController.medical_report ,mainController.medical_report);
router.route("/medical_record").post(upload.array('record_photos',5),loginController.medical_record);

router.route("/show_record").get( loginController.show_record,mainController.show_record );
router.route("/show_record").post( loginController.show_record,mainController.show_record );

router.route("/delete_record_photo").post(loginController.delete_record_photo);
router.route("/add_record_photo").post(upload.array('record_photos',5),loginController.add_record_photo);


router.route("/setting").get(mainController.setting);

router.route("/schedules").get( mainController.schedules );
router.route("/schedule_form").post( loginController.schedule_form );

router.route("/delete_schedule").get( loginController.delete_schedule ); 

router.route("/schedule_checkbox").get( loginController.schedule_checkbox ); 

router.route("/delete_timer_checkbox").get( loginController.delete_timer_checkbox ); 

router.route("/patientappointment").get( mainController.patientappointment ); 
router.route("/patientappointment").post( loginController.patientappointment ); 

router.route("/confirmappointment").get( mainController.confirmappointment ); 

router.route("/deleteappointment").get( loginController.deleteappointment ); 

router.route("/reschedule").get( mainController.reschedule ); 


router.route("/updatereschedule").get( mainController.updatereschedule ); 


router.route("/getschedule").get( loginController.getschedule ); 

router.route("/setschedule").get( loginController.setschedule ); 

//v setschedule

module.exports = router ;




// // router.route("/").get(loginController.checkMainLogin,mainController.home);
 
//   route.get('/', loginController.email_login);
//   route.get('/index', loginController.index )
//   route.get('/doctor',  loginController.doctor)
//   route.get('/hospital',  loginController.hospital)
//   route.get('/treatment', loginController.treatment )
//   route.get('/about_hospital', loginController.about_hospital )

//   route.get('/about_us', loginController.about_us )
//   route.get('/book_appointment', loginController.book_appointment )
//   route.get('/contact', loginController.contact )
//   route.get('/create_password', loginController.create_password )
//   route.get('/doctor_profile', loginController.doctor_profile )

//   route.get('/faq', loginController.faq )
//   route.get('/login', loginController.login )
//   route.get('/signup', loginController.signup )
//   route.get('/otp', loginController.otp )

//   route.get('/submit_your_query', loginController.submit_your_query )
//   route.get('/tvastra_plus', loginController.tvastra_plus )
//   route.get('/phone_login', loginController.phone_login )

