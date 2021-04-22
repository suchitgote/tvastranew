
const express = require('express');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const session = require('express-session');
const flush = require('connect-flash');


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

app.use(session({
	secret: 'SavingLife',
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 *60,
		sameSite: true,
		secure: false
	}
}));

// app.use(flush());
// // load routers
app.use('/', require('./server/routes/router'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



