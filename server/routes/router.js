const express = require('express');
const router = express.Router()

const loginController = require("../controller/loginController")
const mainController = require("../controller/mainController")




router.route("/").get(loginController.checkMainLogin );

router.route("/emaillogin").get(loginController.checkpreLogin,mainController.emaillogin);
router.route("/emaillogin").post(loginController.emaillogin);

router.route("/doctor").get(loginController.checkLogin)//,mainController.doctor);

router.route("/hospital").get(loginController.checkLogin)//,mainController.hospital);

router.route("/about_us").get(loginController.checkLogin)//,mainController.hospital);

router.route("/home").get(loginController.checkLogin,mainController.home);

router.route("/signup").get(mainController.signup);
router.route("/signup").post(loginController.signup);

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




module.exports = router ;







// const express = require('express');
// const route = express.Router()

// const loginController = require('../controller/loginController');
// const controller = require('../controller/controller');

 
// const OtpManager = require("../../otp/OtpManager");
// const otpRepository = require("../../otp/otpRepository");
// const otpSender = require("../../otp/otpSender");
// const otpManager = new OtpManager(otpRepository, { otpLength: 4, validityTime: 5 });


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


//   route.get('/show_user', loginController.show_user )

// // API .......................................................................
// route.post('/api/create_user', controller.create_user);
// route.get('/api/show_user', controller.show_user);

// route.post('/api/email_login', controller.email_login);
// route.post('/api/forgot_password', controller.forgot_password);

// route.post('/api/otp_send', controller.otp_send);
// route.post('/api/create_password', controller.create_password);

// route.post('/api/phone_login', controller.phone_login);


// route.post("/otp/:token", (req, res) => {
//     const otp = otpManager.create(req.params.token);
//     otpSender.send(otp, req.body);
//     res.sendStatus(201);
// });

// route.get("/otp/:token/:code", (req, res) => {
//     const verificationResults = otpManager.VerificationResults;
//     const verificationResult = otpManager.verify(req.params.token, req.params.code);
//     let statusCode;
//     let bodyMessage;

//     switch (verificationResult) {
//         case verificationResults.valid:
//             statusCode = 200;
//             bodyMessage = "OK";
//             break;
//         case verificationResults.notValid:
//             statusCode = 404;
//             bodyMessage = "Not found"
//             break;
//         case verificationResults.checked:
//             statusCode = 409;
//             bodyMessage = "The code has already been verified";
//             break;
//         case verificationResults.expired:
//             statusCode = 410;
//             bodyMessage = "The code is expired";
//             break;
//         default:
//             statusCode = 404;
//             bodyMessage = "The code is invalid for unknown reason";
//     }
//     res.status(statusCode).send(bodyMessage);
// });

  
// module.exports = route ;