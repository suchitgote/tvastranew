const axios = require('axios');
// 24hformat
// const express = require('express')
// const app = express()

const hrformat = require('24hformat');

var models = require('../model/model');

const OtpManager = require("../../otp/OtpManager");
const otpRepository = require("../../otp/otpRepository");
const otpSender = require("../../otp/otpSender");
const { response } = require('express');
const otpManager = new OtpManager(otpRepository, { otpLength: 4, validityTime: 5 });

var ObjectID = require('mongodb').ObjectID;


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
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
        
    if(!(req.body.doctor == "doctor")){
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
    }else{
        // create new user
        console.log("req.body.name = ",req.body.name)
        console.log("req.body.email = ",req.body.email)
        console.log("req.body.password = ",req.body.password)
        console.log("req.body.gender = ",req.body.gender)
        console.log("req.body.data = ",req.body.data)
        console.log("req.body.number = ",req.body.number)
        console.log("req.body.city = ",req.body.city)
        console.log("req.body.state = ",req.body.state)
        console.log("req.body.country = ",req.body.country)
        console.log("req.body.doctor = ",req.body.doctor)

        var tag_inputs = []
        var inputs_arr = [req.body.achivement , req.body.hospital , req.body.qualification , req.body.awards , req.body.specification] ;
    
        for(var j = 0 ; j < inputs_arr.length ;j++){
            var input = JSON.parse(inputs_arr[j]) ;
            console.log(`..............................................${input} = `,  input )
            var arr = [];
            for(var i = 0 ; i < input.length ;i++){
                arr.push(`${input[i].value}`);
            }
            console.log(arr);
            var arr_str = arr.toString()
            console.log(arr_str);
            tag_inputs.push(arr_str)
        }
        req.session.tag_value = tag_inputs ;
        console.log("................................................req.session.tag_value.........",req.session.tag_value) 

        console.log("req.body.yourself = ",req.body.yourself)
        console.log("req.file = ",req.file)
        console.log("req.body.achivement = ",tag_inputs[0])
        console.log("req.body.hospital = ",tag_inputs[1])
        console.log("req.body.experience = ",req.body.experience)
        console.log("req.body.qualification = ",tag_inputs[2])
        console.log("req.body.awards = ",tag_inputs[3])
        console.log("req.body.specification = ",tag_inputs[4])
        console.log("req.body.fees = ",req.body.fees) 
        console.log("req.body.yourself = ",req.body.yourself)

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
            doctor : req.body.doctor,
            
            file : req.file.filename,
            achivement : tag_inputs[0],
            hospital : tag_inputs[1],
            experience : req.body.experience,
            qualification : tag_inputs[2],
            awards : tag_inputs[3],
            specification :tag_inputs[4],
            fees : req.body.fees,
            yourself : req.body.yourself
                                    
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
        delete req.session.update_data ;
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
    var id = req.session.userid.user._id ;
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

    var doctor = req.session.userid.user.doctor ;

    if(id){
        if(!(doctor == "doctor")){
            models.user_schema.updateOne( {'_id' : id}, 
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
    
                    models.user_schema.findOne({ '_id' : id})
                    .then(user=>{
                        req.session.update_data = user;
                        console.log(".......................................req.session.update_data",req.session.update_data)
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


            var tag_inputs = []
            var inputs_arr = [req.body.achivement , req.body.hospital , req.body.qualification , req.body.awards , req.body.specification] ;
        
            for(var j = 0 ; j < inputs_arr.length ;j++){
                var input = JSON.parse(inputs_arr[j]) ;
                console.log(`..............................................${input} = `,  input )
                var arr = [];
                for(var i = 0 ; i < input.length ;i++){
                    arr.push(`${input[i].value}`);
                }
                console.log(arr);
                var arr_str = arr.toString()
                console.log(arr_str);
                tag_inputs.push(arr_str)
            }
            req.session.tag_value = tag_inputs ;
            console.log("................................................req.session.tag_value.........",req.session.tag_value) 
    

            models.user_schema.updateOne( {'_id' : id}, 
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
                "file":  x,
                
                achivement : tag_inputs[0],
                hospital : tag_inputs[1],
                experience : req.body.experience,
                qualification : tag_inputs[2],
                awards : tag_inputs[3],
                specification :tag_inputs[4],
                fees : req.body.fees,
                yourself : req.body.yourself 
            }}  )
                .then(user => {
                    console.log("profile updata succsesful")
                    req.session.update_profile = "profile update successfuly" ;
    
                    models.user_schema.findOne({ '_id' : id})
                    .then(user=>{
                        req.session.update_data = user;
                        console.log(".......................................req.session.update_data",req.session.update_data)
                        res.redirect("/profile");
                    })
                    .catch(err=>{
                        res.redirect("/home");
                    })
                })
                .catch(err => {
                    res.status(500).send({ message : err.message || "Error Occurred while retriving user information for update" })
                })
        }

    }else{
        console.log("profile is not updated");
        req.session.error_message = "profile is not updated" ;
        res.redirect("/profile")
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
                res.redirect("/medical_report");
            }) 
            .catch(err =>{
                res.status(500).send({
                    message : err.message || "Some error occurred while creating a create operation"
                });
            });
} 

const medical_report = (req,res,next)=>{

                if(req.session.update_data){
                  var  y = req.session.update_data.number
                }else{
                  var  y = req.session.userid.user.number ;
                //  console.log("..............................................req.session.userid.userr",req.session.userid.user)
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
          res.redirect("/medical_report");
    })
    .catch(err => {
         console.log("..............................................err",err)
         res.redirect("/emaillogin");
    })

}

const show_record = (req,res, next)=>{
    if(req.body.record_id){
        console.log("..................................................req.body.file =",req.body.record_id)
        req.session.recordid = req.body.record_id ;
    }
    models.medical_record.findOne({_id : req.session.recordid})
    .then(responce =>{
        console.log(".................................................responce=",responce)
        req.session.record_responce = responce ;
        next();
    })
    .catch(err =>{
         
    })

} 

const delete_record_photo = (req,res)=>{

    var filename = req.body.delete_record_photo ;
    var a = req.session.recordid ; 

    console.log("..........................................delete_record_photo.",filename)
    console.log("..........................................a",a)

    models.medical_record.updateOne({"_id":a},{$pull:{"file":{"filename":filename}}},{multi:true} )
    .then(user => {
        req.session.photo_delete = true;
        res.redirect("/show_record");
    })
    .catch(err => {
        console.log("..............................................err",err)
        res.redirect("/emaillogin");
    })
}

const add_record_photo = (req,res)=>{
  
    console.log("..........................................add_record_photo..req.files......................."
    ,req.files)

    // for(var i=0 ; i < req.files.length ; i++ ){
    // }
        models.medical_record.updateOne( { _id :  req.session.recordid } , { $push: { "file": req.files } } )
        .then(user => {
            res.redirect("/show_record");
        })
        .catch(err => {
            console.log("..............................................err",err)
            res.redirect("/emaillogin");
        })


}
    
const tags = (req,res) =>{ 

    var tag_inputs = []
    var inputs_arr = [req.body.input1 , req.body.input2] ;

    for(var j = 0 ; j < inputs_arr.length ;j++){
        var input = JSON.parse(inputs_arr[j]) ;
        console.log(`..............................................${input} = `,  input )
        var arr = [];
        for(var i = 0 ; i < input.length ;i++){
            arr.push(`${input[i].value}`);
        }
        console.log(arr);
        var arr_str = arr.toString()
        console.log(arr_str);
        tag_inputs.push(arr_str)
    }

    req.session.tag_value = tag_inputs ;
    console.log("................................................req.session.tag_value.........",req.session.tag_value) 
    res.redirect("/tags");

}

const schedule_form = (req,res)=>{

    // check schedule is valid or not ........................
    models.user_schema
    .find({ _id :  data.user._id })
    .select({schedule : 1 }) 
    
    .then(user=>{

        // console.log("....................................list of obj with filter user=",user)
        // console.log(".................................... user[0].schedule[0]=",  user[0].schedule[0])
        // console.log(".................................... user[0].schedule[0].day=",  user[0].schedule[0].day)

        function miner (n){
            var startingtime = n ;
            var sts = startingtime.slice(0,2);
            var stss = parseInt(sts);
            var aps= startingtime.slice(6,8)
            if(aps=="PM" && stss != 12){ 
                stss = stss + 12;  
            }
            // console.log("stss=",stss)
            var smin = startingtime.slice(3,5);
            var smin = parseInt(smin);
            var hsmin = stss*60 ;
            var tsmin = hsmin  + smin ;
            // console.log("hsmin=",hsmin  )
            // console.log("smin=",smin  )
            // console.log("tsmin=",tsmin  )
            return tsmin ;
        }
        var comp = false;
        for(var i = 0 ; i < user[0].schedule.length ; i++){  
            if( user[0].schedule[i].day == req.body.day){
                console.log(" req.body.starttime - req.body.totime ",  req.body.starttime + " - " + req.body.totime)
                console.log( `  user[0].schedule[${i}].starttime - user[0].schedule[${i}].totime == `, user[0].schedule[i].starttime + " - " + user[0].schedule[i].totime )

                    console.log("miner(req.body.starttime) =",miner(req.body.starttime)  )
                    console.log("miner(req.body.totime) =",miner(req.body.totime)  )
                    console.log("miner(user[0].schedule[i].starttime) =",miner(user[0].schedule[i].starttime)  )
                    console.log("miner(user[0].schedule[i].totime) =",miner(user[0].schedule[i].totime)  )
                    
                    if( 
                        ( (miner(req.body.starttime) >= miner(user[0].schedule[i].totime)) && (miner(req.body.totime) >= miner(user[0].schedule[i].totime)) )        || 
                        ( (miner(req.body.starttime) <= miner(user[0].schedule[i].starttime)) &&  (miner(req.body.totime) <= miner(user[0].schedule[i].starttime))) 
                      ) {
                        console.log(" ok ")
                    }else{
                            console.log("not ok ")
                            comp = true ;
                    }
            }
        }
       
            if(!comp){
                
                            var schedule_index = req.body.schedule_index ;
                            console.log("req.body.schedule_index = ",req.body.schedule_index)
                        
                            console.log("req.body.day = ",req.body.day)
                            console.log("req.body.hospital = ",req.body.hospital)
                            console.log("req.body.starttime = ",req.body.starttime)
                            console.log("req.body.totime = ",req.body.totime)
                            console.log("req.body.interval = ",req.body.interval)
                        
                            var startingtime = req.body.starttime ;
                            var totime = req.body.totime ;
                            var interval= parseInt(req.body.interval);
                            console.log("starting time=", startingtime);
                            console.log("totime=", totime);
                            console.log("interval=", interval);
                        
                            var tsmin = miner(startingtime); ;
                            var temin = miner(totime);
                
                            var noslots = ( temin - tsmin )  / interval ;
                            console.log(`noslots = ( ${temin} - ${tsmin} ) / ${interval} =`,( temin - tsmin) / interval)
                            noslots = parseInt( noslots.toFixed(0) )
                        
                            console.log("noslots=",noslots)
                            
                            var slots = [];
                            for (i=0; i < noslots; i++)
                            {
                                var hour = startingtime.slice(0,2);
                                // console.log("hour=", hour)
                                var min = startingtime.slice(3,5);
                                var ampm= startingtime.slice(6,8);
                                var hours = parseInt(hour);
                            
                                // console.log("hours=",hours)
                                if(ampm=="PM" && hours != 12)
                                {
                                    hours = hours + 12;
                                }
                                var mins = parseInt(min);
                                var sum = interval + mins;
                            
                                if(interval==60){
                                    hours = hours + 1;
                                    sum = sum - 60;
                                }else if((sum/60) >= 1) {
                                    hours = hours + 1 ;
                                    sum = sum - 60;
                                }
                                else if (sum==60) {
                                    hours = hours + 1;
                                    sum = sum - 60;
                                }
                                var result ;
                                if(hours >= 12) {
                                    hours = hours - 12 ;
                                    if(sum < 10){
                                        result = "0" + `${hours}` + ":" + `0${sum}` + " " + "PM";
                                    }else{
                                        result = "0" + `${hours}` + ":" + `${sum}` + " " + "PM";
                                    }
                                }else {
                                    if(hours == 10 || hours == 11){
                                        if(sum < 10){
                                            result = `${hours}` + ":" + `0${sum}` + " " + "AM";
                                        }else{
                                            result = `${hours}` + ":" + `${sum}` + " " + "AM";
                                        }
                                    }else{
                                        if(sum < 10){
                                            result ="0" + `${hours}` + ":" + `0${sum}` + " " + "AM";
                                        }else{
                                            result ="0" + `${hours}` + ":" + `${sum}` + " " + "AM";
                                        }
                                    }
                                }
                              //  console.log("result=", result);
                                if(i == (noslots - 1)){
                                    if(startingtime.slice(0,2) == "00"){
                                        var replace3 = startingtime.replace("00","12");
                                        slots.push(`${replace3} - ${totime} `)
                                    }else{
                                        slots.push(`${startingtime} - ${totime} `)
                                    }
                                }else{
                                    if(startingtime.slice(0,2) == "00"){
                                        var replace = startingtime.replace("00","12");
                                        if(result.slice(0,2) == "00"){
                                            var replace1 = result.replace("00","12");
                                            slots.push(`${replace} - ${replace1}`)
                                        }else{
                                            slots.push(`${replace} - ${result}`)
                                        }
                                    }else if(result.slice(0,2) == "00"){
                                        var replace2 = result.replace("00","12");
                                        slots.push(`${startingtime} - ${replace2}`)
                                    }else{
                                        slots.push(`${startingtime} - ${result}`)
                                    }
                                }
                                startingtime = result;
                              //  console.log("new starting time=", startingtime)
                            
                            }
                            
                            var emtarr = [];
                            for(var k = 0 ; k < slots.length ; k++ ){
                                emtarr.push({
                                    id:k,
                                    schedule_time:slots[k],
                                    checkbox:"false"
                                })
                            }
                            
                            // console.log("slots = ",slots);
                            // console.log("emtarr =",emtarr);
                        
                            var obj = {
                                schedule_index:schedule_index,
                                schedule_checkbox : "false",
                                day : req.body.day,
                                hospital : req.body.hospital,
                                starttime : req.body.starttime,
                                totime : req.body.totime,
                                interval :req.body.interval ,
                                slots:emtarr
                            }
                        
                            console.log("data.user.number = ",data.user.number)
                            models.user_schema.updateOne( { _id : data.user._id} , { $push: { "schedule": obj } } )
                            .then(response => {
                                models.user_schema.findOne({ _id :  data.user._id})
                                .then(user=>{
                                    req.session.update_data = user;
                                    req.session.schedule_creared = "schedule creared seccesfully"
                                   // console.log(".......................................req.session.update_data",req.session.update_data)
                                    res.redirect("/schedules");
                                })
                                .catch(err=>{
                                    res.redirect("/home");
                                })
                            })
                            .catch(err => {
                                console.log("..............................................err",err)
                                res.redirect("/emaillogin");
                            }) 
            }else{
                req.session.schedule_creared = "time is booked"
                res.redirect("/schedules");
            }

    })
    .catch(err=>{
        res.redirect("/home");
    })


    // end schedule is valid or not ........................

}

const delete_schedule = (req,res)=>{

    console.log("req.query.id",req.query.id)
    var xy = req.query.id ;  
//   var xy =  req.body.delete_schedule  ;
  console.log("..............................................xy",xy)
  console.log("..............................................typeof(xy)",  typeof(xy) )

    models.user_schema.updateOne(
    { _id : data.user._id},
    {$pull : {"schedule" : {schedule_index : xy}}}
    ) 
    .then(user => {
        models.user_schema.findOne({ _id :  data.user._id})
            .then(user=>{
                req.session.update_data = user;
                console.log(".......................................req.session.update_data",req.session.update_data)
                res.redirect("/schedules");
            })
            .catch(err=>{
                res.redirect("/home");
            })
    })
    .catch(err => {
        console.log("..............................................err",err)
        res.redirect("/emaillogin");
    })
}

const schedule_checkbox = (req,res)=>{

    console.log("req.query",req.query)
    console.log("req.query.id",req.query.id)
    var schedule_obj_id = req.query.id ;

    console.log("req.query.id",req.query.status)
    var status = req.query.status ;

    if(status == "true"){ 
        var newstatus = "false" ;
    }else{
        var newstatus = "true" ;
    }

    models.user_schema.updateOne(
        { _id : data.user._id , "schedule.schedule_index" : schedule_obj_id }, {$set : {"schedule.$.schedule_checkbox": newstatus}}
        ) 
        .then(user => {
            models.user_schema.findOne({ _id :  data.user._id})
                .then(user=>{
                    req.session.update_data = user;
                    console.log(".......................................req.session.update_data",req.session.update_data)
                    res.redirect("/schedules");
                })
                .catch(err=>{
                    res.redirect("/home");
                })
        })
        .catch(err => {
            console.log("..............................................err",err)
            res.redirect("/emaillogin");
        })
}

const delete_timer_checkbox = (req,res)=>{
    console.log("req.query",req.query)

    console.log("req.query.id",req.query.id)
    var schedule_obj_id = req.query.id ;

    console.log("req.query.id",req.query.status)
    var status = req.query.status ;

    console.log("req.query.timer_id",req.query.timer_id)
    var timer_id = parseInt( req.query.timer_id );

    if(status == "true"){ 
        var newstatus = "false" ;
    }else{
        var newstatus = "true" ;
    }

    models.user_schema.updateOne(
        { _id : data.user._id }, 
        {$set : {"schedule.$[s].slots.$[si].checkbox": newstatus} },
        {arrayFilters : [{'s.schedule_index':schedule_obj_id},{'si.id': timer_id}] }
        ) 
        .then(user => {
                models.user_schema.findOne({ _id :  data.user._id})
                .then(user=>{
                    req.session.update_data = user;
                    console.log(".......................................req.session.update_data",req.session.update_data)
                    res.redirect("/schedules");
                })
                .catch(err=>{
                    res.redirect("/home");
                })
        })
        .catch(err => {
            console.log("..............................................err",err)
            res.redirect("/emaillogin");
        })

}

const patientappointment = (req,res)=>{

    var obj = {
        name :req.body.doctorname,
        bookhospital:req.body.bookhospital,
        appointmentdate : req.body.appointmentdate ,
        stime: req.body.stime ,
        etime: req.body.etime,
        hospital: req.body.hospital,
        qualification: req.body.qualification,
        doctorid:req.body.doctorid,
        schedule_obj_id:req.body.scheduleid,
        timer_id:req.body.slotid
    }
    var newstatus = "true" ;
    var schedule_obj_id = req.body.scheduleid ;
    var timer_id = parseInt( req.body.slotid ) ;

    console.log("log patientappointment obj ",obj ) ;
    console.log(" newstatus = ",newstatus ) ;
    console.log(" schedule_obj_id = ",schedule_obj_id ) ;
    console.log(" timer_id = ",timer_id ) ;

    models.user_schema.updateOne( { _id : data.user._id},
          { $push:{appointments:
        {   _id:ObjectID(),        
            name :req.body.doctorname,
            bookhospital:req.body.bookhospital,
            appointmentdate : req.body.appointmentdate ,
            stime: req.body.stime ,
            etime: req.body.etime,
            hospital: req.body.hospital,
            qualification: req.body.qualification,
            doctorid:req.body.doctorid,
            scheduleid:schedule_obj_id,
            slotid:timer_id
          }}})

    .then(response => {

        models.user_schema.updateOne(
            { _id : req.body.doctorid }, 
            {$set : {"schedule.$[s].slots.$[si].checkbox": "true"} },
            {arrayFilters : [{'s.schedule_index':schedule_obj_id},{'si.id': timer_id}] }
            ) 
            .then(user => {
                models.user_schema.findOne({ _id :  data.user._id})
                .then(user=>{
                    req.session.update_data = user;
                    res.redirect("/confirmappointment");
                })
                .catch(err=>{
                    res.redirect("/home");
                }) 
            })
            .catch(err => {
                console.log("..............................................err",err)
                res.redirect("/emaillogin");
            })
    })
    .catch(err => {
        console.log("..............................................err",err)
        res.redirect("/emaillogin");
    }) 
}

const deleteappointment = (req,res)=>{

    var hulk = req.query.objid

    console.log("...................... bookhospital ......hulk",hulk)
    
    models.user_schema.updateOne({"_id":data.user._id},{$pull:{ "appointments":{"_id":ObjectID(`${hulk}`)}}} )
    .then(user => {
        models.user_schema.findOne({ _id :  data.user._id})
        .then(user=>{
            req.session.update_data = user;
            res.redirect("/appointment");
        })
        .catch(err=>{
            res.redirect("/home");
        })
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
    medical_report:medical_report,
    delete_record:delete_record,
    show_record:show_record,
    delete_record_photo:delete_record_photo,
    add_record_photo:add_record_photo,
    tags:tags,
    schedule_form:schedule_form,
    delete_schedule:delete_schedule,
    schedule_checkbox:schedule_checkbox,
    delete_timer_checkbox:delete_timer_checkbox,
    patientappointment:patientappointment,
    deleteappointment:deleteappointment   

}






