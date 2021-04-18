
const express = require('express');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');

const app = express();
const port = 3000 ;

const connectDB = require('./server/database/connection');

// log requests
app.use(morgan('tiny'));

// mongodb connection
connectDB();

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}))

//load ejs file
app.set("view engine", "ejs")

// load css files
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))

// load routers
app.use('/', require('./server/routes/router'))


const OtpManager = require("./otp/OtpManager");
const otpRepository = require("./otp/otpRepository");
const otpSender = require("./otp/otpSender");

const otpManager = new OtpManager(otpRepository, { otpLength: 5, validityTime: 5 });

app.post("/otp/:token", (req, res) => {
    const otp = otpManager.create(req.params.token);
    otpSender.send(otp, req.body);
    res.sendStatus(201);
});

app.get("/otp/:token/:code", (req, res) => {
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
            bodyMessage = "Not found"
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
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



