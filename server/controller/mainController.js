

var models = require('../model/model');
const axios = require('axios');
const { reset } = require('nodemon');

var ObjectID = require('mongodb').ObjectID;


const emaillogin = (req, res) => {
    console.log("mai emlog ")
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

const demodoc = (req,res)=>{

    models.user_schema.find({"doctor" : "doctor"})
    .select({name : 1 ,_id : 1,specification:1,hospital:1,qualification:1,experience:1,city:1,fees:1,state:1,colony:1}) 
    .then(user=>{
        
        var all_doc_check = user;
        console.log("......................................all_doc_check",all_doc_check)
        
        
        var a = req.body.city;
        var b = req.body.hospital;
        var c = req.body.experience;
        var s = req.body.specification;

        var emp =[];
        if(a != undefined) {
            emp.push(a);
        }
        if(b != undefined) {
            emp.push(b);
        }
        if(c != undefined) {
            emp.push(c);
        }
        if(s != undefined) {
            emp.push(s);
        }
        console.log("emparray",emp)
        

    
        console.log("aaaaaaaaa",a);
        console.log("bbbbbbbbbbbbb",b);
        console.log("ccccccccccccccc",c);
        console.log("ssssssssssss",s);
       
        var match = [{ "doctor" :  "doctor"}];
        
        if(a == undefined) {
            a = [];
         }
        if(b == undefined) {
           b = [];
        }
         if(c == undefined) {
            c = [];
         }
         if(s == undefined) {
            s = [];
         }   

        if(typeof(a)== "string") {
            match.push({city : {$regex : a,$options:"$i"}})
        }
        else {
            for(var i=0;i <a.length; i++) {
                match.push({city : {$regex : a[i],$options:"$i"}})
            }
        }
        
        if(typeof(b)== "string") {
            match.push({hospital : {$regex : b,$options:"$i"}}) 
        }
        else {
            for(var i=0;i <b.length; i++) {
                match.push({hospital : {$regex : b[i],$options:"$i"}})
            }
        }

        if(typeof(c)== "string") {
            match.push({experience : {$regex : c,$options:"$i"}})
        }
        else {
    
            for(var i=0;i < c.length; i++) {
                match.push({experience : {$regex : c[i],$options:"$i"}})
            }
        }

        if(typeof(s)== "string") {
            match.push({specification : {$regex : s,$options:"$i"}})
        }
        else {
    
            for(var i=0;i < s.length; i++) {
                match.push({specification : {$regex : s[i],$options:"$i"}})
            }
        }


        console.log("match",match);
       
        var query = { "$and" : [] }
    
        for (var i = 0; i < match.length; i++) {
            query["$and"].push( match[i] );
        }
       
        console.log("queryyyyyyyyyyyyyyyyyyyyyyy",query);
    
        var sortby  ;
        var sortbyvalue  ;
        
        if(req.body.name == "name"){ 
            sortby ="name"
            sortbyvalue = 1
        }
        if(req.body.name == "-name"){ 
            sortby ="name"
            sortbyvalue = -1
        }
        if(req.body.name == "experience"){ 
            sortby ="experience"
            sortbyvalue = 1
        }
        if(req.body.name == "-experience"){ 
            sortby ="experience"
            sortbyvalue = -1
        }
        if(req.body.name == "fees"){ 
            sortby ="fees"
            sortbyvalue = 1
        }
        if(req.body.name == "-fees"){ 
            sortby ="fees"
            sortbyvalue = -1
        }
            console.log("sortby",sortby)
            console.log("sortbyvalue",sortbyvalue)
      
            if((sortby == "name") || (sortby == "-name")){
                var obj = {"name" : sortbyvalue}
            }
            if((sortby == "experience") || (sortby == "-experience")){
                var obj = {"experience" : sortbyvalue}
            }
            if((sortby == "fees") || (sortby == "-fees")){
                var obj = {"fees" : sortbyvalue}
            }

        console.log("obj",obj) ;
        
        models.user_schema.find(query)
        .sort(obj)
        .select({name : 1 ,_id : 1,specification:1,hospital:1,qualification:1,experience:1,city:1,fees:1,state:1,colony:1}) 
        .then(user=>{
            console.log("......................................doctors specific data",user)
            var pageno = parseInt(req.body.pageno);
            console.log("pageno",pageno);
            var st = 0;
            var et = 2;
            var noofuser = user.length

            
            if(pageno){
                 st = (pageno - 1)*2 ;
                 et = pageno*2 ;
            }
                user = user.slice(st,et);
                
            console.log("user",user);
            
               var isdoctor = req.session.isdoctor ;
                console.log(".......isdoctor",isdoctor)
                if(isdoctor){
                    delete req.session.isdoctor ;
                    if(req.session.update_data){
                        res.render("demodoc", data = { user: req.session.update_data , doctors :user,noofuser:noofuser ,all_doc_check : all_doc_check ,emp : emp ,err:isdoctor });
                    }else{
                        res.render("demodoc", data = { user: req.session.userid.user , doctors :user,noofuser:noofuser ,all_doc_check : all_doc_check ,emp : emp ,err:isdoctor });
                    }
                }else{
                    if(req.session.update_data){
                        res.render("demodoc", data = { user: req.session.update_data , doctors :user,noofuser:noofuser ,all_doc_check : all_doc_check ,emp : emp});
                    }else{
                        res.render("demodoc", data = { user: req.session.userid.user , doctors :user,noofuser:noofuser ,all_doc_check : all_doc_check ,emp : emp});
                    }
                }
        })
        .catch(err=>{
            res.redirect("/home");
        })
       
    })
    .catch(err=>{
        res.redirect("/home");
    })



    // var isdoctor = req.session.isdoctor ;
    // console.log(".......isdoctor",isdoctor)
    // if(isdoctor){
    //     delete req.session.isdoctor ;
    //     res.render("demodoc", data = { user: req.session.userid.user , doctors :user ,err:isdoctor});
    // }else{
    //     res.render("demodoc", data = { user: req.session.userid.user , doctors :user });
    // }
   // res.render("demodoc", data = { user: req.session.userid.user , doctors :user ,err:isdoctor});
    
}

const hospital = (req,res)=>{
    res.render("hospital", data = { user: false });
}

const about_us = (req,res)=>{
    res.render("about_us", data = { user: false });
}

const profile = (req,res)=>{
    // var record = req.session.record ;
    // delete req.session.record ;
    // console.log("..............................................record = req.session.record .",record)
    
    if(req.session.update_profile){
        console.log("...........................,req.session.update_profile...",req.session.update_profile)
        var update_profile = req.session.update_profile;
        if(update_profile ==  req.session.update_profile){
            delete req.session.update_profile ;
            if(req.session.userid.user.type == "admin"){
                res.render("profile", data = { user: false ,succ : update_profile ,admin :req.session.userid.user }); // ,record: record
             }else{ 
                res.render("profile", data = { user: req.session.update_data ,succ : update_profile }); // ,record: record
             } 
        }
    }else{
        if(req.session.update_data){
            res.render("profile", data = { user: req.session.update_data  }); 
        }else{
             if(req.session.userid.user.type == "admin"){
                res.render("profile", data = { admin: req.session.userid.user ,user :false});
             }else{ 
                 res.render("profile", data = { user: req.session.userid.user });
             } 
        }
    }
}

const medical_report = (req,res)=>{
    var record = req.session.record ;
    delete req.session.record ;
    if(req.session.update_data){
        if(req.session.userid.user.type == "admin"){
            if(req.session.admin_update_data){
                res.render("medical_report", data = { user: false , record: record ,admin : req.session.admin_update_data });
            }else{
                res.render("medical_report", data = { user: false , record: record ,admin : req.session.userid.user });
            }
        }else{
            res.render("medical_report", data = { user: req.session.update_data , record: record ,admin :false});
        }
    }else{
        if(req.session.userid.user.type == "admin"){
            console.log("i cmc ,req.session.i,data.userlist= ",req.query.i,req.session.i,data.userlist)
            res.render("medical_report", data = { user: false , record: record ,admin : req.session.userid.user });
        }else{
            res.render("medical_report", data = { user: req.session.userid.user , record: record ,admin :false});
        }
    }
    
}

const appointment = (req,res)=>{
    if(req.session.update_data){
        if(req.session.userid.user.type == "admin"){
            res.render("appointment", data = { user: req.session.update_data ,admin : req.session.userid.user });
        }else{
            res.render("appointment", data = { user: req.session.update_data  });
        }
    }else{
        res. render("appointment", data = { user: req.session.userid.user  });
    }
}

const setting = (req,res)=>{
    if(req.session.update_data){
        res.render("setting", data = { user: req.session.update_data  });
    }else{
        res. render("setting", data = { user: req.session.userid.user  });
    }
}

const show_record = (req,res)=>{

    var sec_var = req.session.record_responce ;
    delete req.session.record_responce ;

   // console.log(".................................................sec_var=",sec_var) ;
 //   console.log(".............................................array....sec_var.file=",sec_var.file) ;


    if(req.session.update_data){
        if(req.session.userid.user.type == "admin"){
            if(req.session.admin_update_data){
                res.render("show_record", data = { admin: req.session.admin_update_data , record_photos: sec_var.file  });
            }else{
                res.render("show_record", data = { admin: req.session.userid.user , record_photos: sec_var.file  });
            }
        }else{
            res.render("show_record", data = { user: req.session.update_data , record_photos: sec_var.file  });
        }
    }else{
        if(req.session.userid.user.type == "admin"){
            res.render("show_record", data = { admin: req.session.userid.user , record_photos: sec_var.file });
        }else{
            res.render("show_record", data = { user: req.session.userid.user , record_photos: sec_var.file });
        }
    }
}

const schedules = (req,res)=>{
    if(req.session.update_data){
        var x = req.session.update_data ;
        if(req.session.schedule_creared){
            var y = req.session.schedule_creared ;
            delete req.session.schedule_creared ;
            res.render("schedules", data = { user: x ,succ : y});
        }else{
            res.render("schedules", data = { user: x });
        }
    }else{
        if(req.session.schedule_creared){
            var y =req.session.schedule_creared;
            delete req.session.schedule_creared;
            res. render("schedules", data = { user: req.session.userid.user ,succ : y });
        }else{
            res. render("schedules", data = { user: req.session.userid.user  });
        }
    }
}

const patientappointment = (req,res)=>{

    var obj = {
        appointmentdate : req.query.appointmentdate ,
        stime: req.query.time.slice(0,8) ,
        etime: req.query.time.slice(10,19),
        name :req.query.name,
        hospital:req.query.hospital,
        qualification:req.query.qualification,
        bookhospital:req.query.bookhospital,
        doctorid:req.query.doctorid,
        scheduleid:req.query.scheduleid,
        slotid:req.query.slotid,

    }
    console.log("main pati obj ",obj ) ;

if(req.query.isdoctor == "doctor"){
    req.session.isdoctor = "you can't book appointment as a doctor" ;
    res.redirect("demodoc") ;
}else{
    res.render("patientappointment", data = { user: req.session.userid.user , obj : obj})
}

}

const confirmappointment = (req,res)=>{

    var l = req.session.update_data.appointments.length
    var obj ={
        appointmentdate : req.session.update_data.appointments[l-1].appointmentdate,
        stime:req.session.update_data.appointments[l-1].stime,
        etime: req.session.update_data.appointments[l-1].etime,
        name :req.session.update_data.appointments[l-1].name,
        hospital:req.session.update_data.appointments[l-1].hospital,
        qualification:req.session.update_data.appointments[l-1].qualification,
        bookhospital:req.session.update_data.appointments[l-1].bookhospital,
        objid:req.session.update_data.appointments[l-1]._id,
        doctorid:req.session.update_data.appointments[l-1].doctorid

    }
    console.log("confirmappointment obj ",obj ) ;

    res.render("confirmappointment", data = { user: req.session.update_data , obj : obj})

}

const reschedule = (req,res)=>{
    
    if(req.query.objindex && req.session.update_data){

        var i = req.query.objindex ;
        var obj = {
            appointmentdate : req.session.update_data.appointments[i].appointmentdate,
            stime:req.session.update_data.appointments[i].stime,
            etime: req.session.update_data.appointments[i].etime,
            name :req.session.update_data.appointments[i].name,
            hospital:req.session.update_data.appointments[i].hospital,
            qualification:req.session.update_data.appointments[i].qualification,
            bookhospital:req.session.update_data.appointments[i].bookhospital,
            objid:req.session.update_data.appointments[i]._id,
            doctorid:req.session.update_data.appointments[i].doctorid,
        }
        console.log("...........................obj ",obj ) ;

      
    }else if(req.query.objindex ){

        var i = req.query.objindex ;
        if(req.session.userid.user.type == "admin"){
            var obj = {
                appointmentdate : data.user.appointments[i].appointmentdate,
                stime:data.user.appointments[i].stime,
                etime: data.user.appointments[i].etime,
                name :data.user.appointments[i].name,
                hospital:data.user.appointments[i].hospital,
                qualification:data.user.appointments[i].qualification,
                bookhospital:data.user.appointments[i].bookhospital,
                objid:data.user.appointments[i]._id,
                doctorid:data.user.appointments[i].doctorid,
            }
        }else{
            var obj = {
                appointmentdate : req.session.userid.user.appointments[i].appointmentdate,
                stime:req.session.userid.user.appointments[i].stime,
                etime: req.session.userid.user.appointments[i].etime,
                name :req.session.userid.user.appointments[i].name,
                hospital:req.session.userid.user.appointments[i].hospital,
                qualification:req.session.userid.user.appointments[i].qualification,
                bookhospital:req.session.userid.user.appointments[i].bookhospital,
                objid:req.session.userid.user.appointments[i]._id,
                doctorid:req.session.userid.user.appointments[i].doctorid,
            }
        }
        console.log("...........................obj ",obj ) ;

    }else{

        var l = req.session.update_data.appointments.length
        var obj = {
            appointmentdate : req.session.update_data.appointments[l-1].appointmentdate,
            stime:req.session.update_data.appointments[l-1].stime,
            etime: req.session.update_data.appointments[l-1].etime,
            name :req.session.update_data.appointments[l-1].name,
            hospital:req.session.update_data.appointments[l-1].hospital,
            qualification:req.session.update_data.appointments[l-1].qualification,
            bookhospital:req.session.update_data.appointments[l-1].bookhospital,
            objid:req.session.update_data.appointments[l-1]._id,
            doctorid:req.session.update_data.appointments[l-1].doctorid,
        }
        console.log("obj ",obj ) ;

    }



    models.user_schema.findOne({ "_id" :  obj.doctorid })
    .then(user=>{
        console.log("......................................doctor user",user)

        var user_array = user ;
        // console.log("docarray", docarray);

            // console.log(`user${i} = `, user_array[i]);
            var schedule = user_array.schedule;
            // console.log(`schedule = `, schedule);
            var days = [ [],[],[],[],[],[] ];
            var y = -1 ;
            var y2 = -1;
            var y3 = -1;
            var y4 = -1;
            var y5 = -1;
            var y6 = -1;

            for(var j = 0 ; j < schedule.length ; j++){
                var hi = schedule[j].day ;
                console.log("hi",hi)

                if( 'Monday' == hi ){
                    console.log("Monday" == hi)
                    var x = 0;
                    if(y > x){
                        console.log("y run....")
                      days[0][y] = schedule[j] ;
                    }else{
                    console.log("else   run....")
                      days[0][x] = schedule[j] ;
                        y = x;
                        y++;
                    }
                }
                else if( "Tuesday"  == hi ){
                    console.log("Tuesday" == hi)
                    var x2 = 0;
                    var sub_arr2;
                    if(y2>0){
                        console.log("y run....")
                      days[1][y2] = schedule[j] ;
                    }else{
                        console.log("else run....")
                      days[1][x2] = schedule[j] ;
                        y2 = x2;
                        y2++;
                    }
                }
                else if( "Wednessday"  == hi ){
                    console.log("Wednessday" == hi)
                    var x3 = 0;
                    if(y3>0){
                        console.log("y run....")
                      days[2][y3] = schedule[j] ;
                    }else{
                        console.log("else run....")
                      days[2][x3] = schedule[j] ;
                        y3 = x3;
                        y3++;
                    }
                }
                else if( "Thrusday"  == hi ){
                    console.log("Thrusday" == hi)
                    var x4 = 0;
                    if(y4>0){
                        console.log("y run....")
                      days[3][y4] = schedule[j] ;
                    }else{
                        console.log("else run....")
                      days[3][x4] = schedule[j] ;
                        y4 = x4;
                        y4++;
                    }
                }
                else if( "Friday"  == hi ){
                    console.log("Friday" == hi)
                    var x5 = 0;
                    if(y5>0){
                        console.log("y run....")
                      days[4][y5] = schedule[j] ;
                    }else{
                        console.log("else run....")
                      days[4][x5] = schedule[j] ;
                        y5 = x5;
                        y5++;
                    }
                }
                else if("Saturday" == hi){
                    console.log("Saturday" == hi)
                    var x6 = 0;
                    if(y6>0){
                        console.log("y run....")
                      days[5][y6] = schedule[j] ;
                    }else{
                        console.log("else run....")
                      days[5][x6] = schedule[j] ;
                        y6 = x6;
                        y6++; 
                    }
                }
            }
            // console.log("days = ",days)
            // var days = [["1m"],["2t"],["3w"],["4th"],["5f"],["6sa"]]

            var d = new Date();
            var n = d.getDay()
            console.log("n = ",n); 
            // n = 3;
            var newdays = [];
            for(var x = 0 ; x < days.length ; x++){
            
                if(n == 0 || n == 7){
                        // console.log("x,n = ",x,n)
                        newdays.push([])
                        // console.log("newdays = ",newdays)
                    n++ ;
                }
                if(n > days.length){
                    // console.log("x,n = ",x,n)
                    newdays.push(days[n - (days.length + 1 + 1)])
                    // console.log("newdays = ",newdays)
                    n++ ;
                }else{
                    // console.log("x,n = ",x,n)
                    newdays.push(days[n-1])
                    // console.log("newdays = ",newdays)
                    n++ ;
                }
            }
            
            console.log("newdays = ",newdays)

            user_array.schedule = newdays ;

        console.log("user_array = ",user_array)
        if(req.session.update_data){
            res.render("reschedule", data = { user: req.session.update_data , obj : obj , doctors :user_array})
        }else{
            if(req.session.userid.user.type == "admin"){
                res.render("reschedule", data = { user: data.user , obj : obj , doctors :user_array})
            }else{
                res.render("reschedule", data = { user: req.session.userid.user , obj : obj , doctors :user_array})
            }
        }
    })
    .catch(err=>{
        res.redirect("/home");
    })

    
    
}

const updatereschedule = (req,res)=>{
    var appointmentdate = req.query.appointmentdate ;
    var bookhospital = req.query.bookhospital ;
    var time = req.query.time ;
    var doctorid = req.query.doctorid ;
    var objid = req.query.objid ;

    var stime = time.slice(0,8);
    var etime = time.slice(11,19);

    console.log(
        "appointmentdate",appointmentdate,
        "bookhospital",bookhospital,
        "stime",stime,
        "etime",etime,

        "doctorid",doctorid,
        "objid",objid
    )

    models.user_schema.updateOne(
    { _id : data.user._id }, 
    {$set : 
        {"appointments.$[s].appointmentdate": appointmentdate,
        "appointments.$[s].stime": stime,
        "appointments.$[s].etime": etime,
        "appointments.$[s].bookhospital": bookhospital} 
    },
    {arrayFilters : [{'s._id':ObjectID(objid) }] }
    ) 
    .then(user => {
        console.log("...................res .................................user",user)
        models.user_schema.findOne({ _id :  data.user._id})
        .then(user=>{
            req.session.update_data = user;
            res.redirect("/appointment");
        })
        .catch(err=>{
            res.status(500).send({ message : err.message || "Error Occurred while retriving user information for update" })
        })
    })
    .catch(err => {
        res.status(500).send({ message : err.message || "Error Occurred while retriving user information for update" })
    })
 


}

const admin = (req,res)=>{

    models.user_schema.find()
    .then(user=>{
        var totaluser = 0;
        var totaldoctor = 0;
        var appointments = 0;
        var patient = [];
        var obj = {};
        var emtarr = []; 

        for(var i=0; i < user.length ;i++){
            if(user[i].type == "user"){
                totaluser++ ;
                appointments = appointments +  user[i].appointments.length ;
                if(user[i].appointments.length > 0){
                    var patientdata = {}
                    patientdata.id = user[i]._id ;
                    patientdata.name = user[i].name ;
                    patientdata.number = user[i].number ;
                    patientdata.email = user[i].email ;

                    patient.push(patientdata) ;
                }
            }
            if(user[i].type == "doctor"){
                totaldoctor++ ;

                    var typehospital= user[i].hospital.split(",");
                    // console.log("typehospital = ",typehospital );
                    
                    for(var j=0; j< typehospital.length ;j++) {
                        if(emtarr.length > 0){
                            for(var k=0; k < emtarr.length; k++){
                             var ok = 0;
                                if(typehospital[j].toLowerCase() == emtarr[k] ){
                                    k = emtarr.length;
                                }else{
                                     ok = 1;
                                }
                            }
                            if(ok){
                                emtarr.push(typehospital[j].toLowerCase()); 
                            }
                        }else{ 
                            emtarr.push(typehospital[j].toLowerCase())  
                       }
                   } 
                console.log("emtarr = ",emtarr );
                console.log("emtarr.length = ",emtarr.length );

                
            }
        }
        obj.totaluser =totaluser ;
        obj.totaldoctor =totaldoctor ;
        obj.appointments =appointments ;
        obj.hospital =emtarr.length ;
        obj.patient =patient ;

        req.session.admin = obj ;
        console.log("obj",obj );
        if(req.session.admin_update_data){
            //admin_update_data
            res.render("admin", data = { succ: req.session.message.success , admin: req.session.admin_update_data , obj:obj } )
        }else{
            res.render("admin", data = { succ: req.session.message.success , admin: req.session.userid.user , obj:obj } )
        }
    })
    .catch(err=>{
        res.send("/emaillogin");
    })
    

}

const useradmin = (req,res)=>{

    models.user_schema.find({type : "user"})
    .then(user=>{
        var userlist = [];
        for( var i = 0; i < user.length ;i++ ){
            var patientdata = {} ;
            patientdata.id = user[i]._id ;
            patientdata.name = user[i].name ;
            patientdata.number = user[i].number ;
            patientdata.email = user[i].email ;
            patientdata.gender = user[i].gender ;
            patientdata.date = user[i].data ;
            patientdata.city = user[i].city ;
            patientdata.state = user[i].state ;

            userlist.push(patientdata) ;
        }

        if(req.session.admin_update_data){
            // res.render("profile", data = { user: user ,admin : req.session.admin_update_data });
            res.render("useradmin", data = {  admin : req.session.admin_update_data, userlist : userlist } )

        }else{
            // res.render("profile", data = { user: req.session.update_data  });
            res.render("useradmin", data = {  admin : req.session.userid.user , userlist : userlist } )
        }
    })
    .catch(err=>{
        res.send("/emaillogin");
    })
    
}

const admineditprofile = (req,res)=>{
    
    console.log("admineditprofile ",req.query.userid)

    models.user_schema.findOne( { _id :  req.query.userid }  )
    .then(user => {
        console.log("user = ",user)

        if(req.session.update_data){
            if(req.session.admin_update_data){
                res.render("profile", data = { user: user ,admin : req.session.admin_update_data });
            }else{
                res.render("profile", data = { user: req.session.update_data  });
            }
        }else{
            res.render("profile", data = { user: user ,admin : req.session.userid.user });
        }
    })
    .catch(err => {
        res.status(500).send({ message : err.message || "Error Occurred while retriving user information for update" })
    })

}


const doctoradmin = (req,res)=>{

    models.user_schema.find({type : "doctor"})
    .then(user=>{
        var userlist = [];
        for( var i = 0; i < user.length ;i++ ){
            var patientdata = {} ;
            patientdata.id = user[i]._id ;
            patientdata.name = user[i].name ;
            patientdata.specification = user[i].specification ;
            patientdata.qualification = user[i].qualification ;
            patientdata.experience = user[i].experience ;
            patientdata.hospital = user[i].hospital ;
            patientdata.city = user[i].city ;
            patientdata.state = user[i].state ;
            patientdata.fees = user[i].fees ;

            userlist.push(patientdata) ;
        }
        console.log("user[0]",user[0])

        if(req.session.admin_update_data){
            res.render("doctoradmin", data = {  admin : req.session.admin_update_data, userlist : userlist } )

        }else{
            res.render("doctoradmin", data = {  admin : req.session.userid.user , userlist : userlist } )
        }
    })
    .catch(err=>{
        res.send("/emaillogin");
    })
    
}

const admindoctorallappointment = (req,res)=>{

    models.user_schema.findOne({ _id : req.query.id })
    .select({appointments : 1,_id : 1 })
    .then(user=>{
        console.log("user = ",user) ;
        res.render("admindoctorallappointment", data = {  admin : req.session.userid.user , useridapp : user } )

    })
    .catch(err=>{
        res.send("/emaillogin");
    })
}

module.exports = {
    emaillogin: emaillogin,
    signup: signup,
    show_user: show_user,
    home:home,
    otp: otp,
    create_password:create_password,
    phone_login:phone_login,
    demodoc:demodoc,
    hospital:hospital,
    about_us:about_us,
    profile:profile,
    appointment:appointment,
    medical_report:medical_report,
    setting:setting,
    show_record:show_record,
    schedules:schedules,
    patientappointment:patientappointment,
    confirmappointment:confirmappointment,
    reschedule:reschedule,
    updatereschedule:updatereschedule,
    admin:admin,
    useradmin:useradmin,
    admineditprofile:admineditprofile,
    doctoradmin:doctoradmin,
    admindoctorallappointment:admindoctorallappointment

}




