

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
    res.render("signup", data = { user: false , doclog :false});
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

    
    
    models.user_schema.find({type : "doctor"})
    .then(user=>{
        var userlist = [[]];
        for( var i = 0; i < user.length ;i++ ){
            userlist[0].push(user[i].name) ;
        }

        for(var l=1; l < 3; l++) { 
           
            var emtarr = []; 
            for(var i=0; i < user.length; i++) { 
                if(l==1){
                    var typehospital= user[i].specification.split(",")
                } else{
                    var typehospital= user[i].hospital.split(",")
                }
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
            } 
            console.log("emtarr",emtarr) ;
            userlist.push(emtarr) ;

        }
        console.log("userlist",userlist) ;



            if(req.session.message && req.session.userid.count==0){
                req.session.userid.count = 1;
                res.render("index",data = {succ: req.session.message.success , user: req.session.userid.user , userlist : userlist  });
            }
            else{
                if(req.session.update_data){
                    res.render("index",data = {succ: null,user:req.session.update_data , userlist : userlist  });
                } else{
                    res.render("index",data = {succ: null,user:req.session.userid.user , userlist : userlist  });
                }
            }
    })
    .catch(err=>{
        res.send("/emaillogin");
    })
    
    


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
 
const otpnew = (req, res) => {
    if(req.session.otp_err){
        var otp_error = req.session.otp_err ;
        delete req.session.otp_err ;
        res.render("otp" ,data = {err : otp_error ,user :false});
    } else if (req.session.otp_succ){
        var otp_succ = req.session.otp_succ ;
        delete req.session.otp_succ ;
        if(req.session.userid.user.type == "admin"){
            // res.render("profile", data = { admin: req.session.userid.user ,user :false});
            if(data.user){
                res.render("otpnew" ,data = {succ : otp_succ , user : data.user ,admin : req.session.userid.user });
            }else{
                res.render("otpnew" ,data = {succ : otp_succ ,admin : req.session.userid.user });
            }

         }else{ 
            //  res.render("profile", data = { user: req.session.userid.user });
            res.render("otpnew" ,data = {succ : otp_succ ,user : req.session.userid.user });
         } 
    } else {
        res.render("otp" ,data = {succ : false , user : req.session.userid.user  });
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
    .select({name : 1 ,_id : 1,specification:1,hospital:1,qualification:1,experience:1,city:1,fees:1,state:1,file:1}) 
    .then(user=>{
        
        var all_doc_check = user;
        // console.log("......................................all_doc_check",all_doc_check)
        
        
        var a = req.body.city;
        var b = req.body.hospital;
        var c = req.body.experience;
        console.log(".........................................c ",c); 
        console.log( "........................................typeof(c)....",typeof(c) ); 

        if(c != undefined) {
                c = parseInt(c) ;
        }
        var s = req.body.specification;

        var doctorname = undefined ;


        
        var sortinput = req.body.sortinput ;
        console.log(".............sortinput",sortinput); 
        if(sortinput != undefined){
            console.log(".............sortinput.slice( sortinput.length-1 , sortinput.length )",sortinput.slice( sortinput.length-1 , sortinput.length )); 
 
            if(sortinput.slice( 0 , 3 ) == "   " ){
                doctorname  = sortinput.slice( 3 , sortinput.length )
                console.log(".............doctorname = sortinput.slice( 0 , 3 )",doctorname); 
            }
            else if(sortinput.slice( 0 , 2 ) == "  " ){
                b = sortinput.slice( 2 , sortinput.length )
                console.log(".............b = sortinput.slice( 0 , sortinput.length-2 )",b); 
            }
            else{
                s = sortinput.slice( 1 , sortinput.length )
                console.log("............s =.sortinput.slice( 0 , sortinput.length-1 )",s); 
            }
        }


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

        console.log("doctorname",doctorname );

       

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
         if(doctorname == undefined) {
            doctorname = [];
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


        if(typeof(c)== "number") {
            match.push({experience : {$gte: c}})    // {field: {$gt: value} }
        }
        else {
            for(var i=0;i < c.length; i++) {
                match.push({experience : {$gte: (c[i])}})
            }
        }

        if(typeof(s)== "string") {
            match.push({specification : {$regex : s,$options:"$i"}})
        }
        else {
    
            for(var i=0;i < s.length; i++) {
                match.push({specification : {$regex : s[i] , $options:"$i"}})
            }
        }

        if(typeof(doctorname) == "string") {
            match.push({name : {$regex : doctorname , $options:"$i"}})
        }
        else {
            for(var i=0;i < doctorname.length; i++) {
                match.push({specification : {$regex : s[i] , $options:"$i"}})
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
        .select({name : 1 ,_id : 1,specification:1,hospital:1,qualification:1,experience:1,city:1,fees:1,state:1,colony:1,file:1}) 
        .then(user=>{
            // console.log("......................................doctors specific data",user)
            var pageno = parseInt(req.body.pageno);
            console.log("pageno",pageno);
            var st = 0;
            var et = 3;
            var noofuser = user.length

            
            if(pageno){
                 st = (pageno - 1)*3 ;
                 et = pageno*3 ;
            }
                user = user.slice(st,et);
                
            console.log("user",user);
            
               var isdoctor = req.session.isdoctor ;
                console.log(".......isdoctor",isdoctor)
                if(isdoctor){
                    delete req.session.isdoctor ;
                    if(req.session.update_data){
                        res.render("demodoc", data = { user: req.session.update_data , doctors :user,noofuser:noofuser ,pagenoselected:pageno ,all_doc_check : all_doc_check ,emp : emp ,err:isdoctor });
                    }else{
                        res.render("demodoc", data = { user: req.session.userid.user , doctors :user,noofuser:noofuser ,pagenoselected:pageno,all_doc_check : all_doc_check ,emp : emp ,err:isdoctor });
                    }
                }else{
                    if(req.session.update_data){
                        res.render("demodoc", data = { user: req.session.update_data , doctors :user,noofuser:noofuser ,pagenoselected:pageno,all_doc_check : all_doc_check ,emp : emp});
                    }else{
                        res.render("demodoc", data = { user: req.session.userid.user , doctors :user,noofuser:noofuser ,pagenoselected:pageno ,all_doc_check : all_doc_check ,emp : emp});
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


    
}

const hospital = (req,res)=>{

    models.hospital_list.find()
    .then(user=>{
        console.log("hospitals list user",user)
        if(req.session.update_data){
            res.render("hospital",data = {succ: null,user:req.session.update_data , userlist : user  });
        } else{
            res.render("hospital",data = {succ: null,user:req.session.userid.user , userlist : user  });
        }
    })
    .catch(err=>{
        res.send("/emaillogin");
    })
    
}

const treatment = (req,res)=>{
    if(req.session.update_data){
        res.render("treatment",data = {succ: null,user:req.session.update_data});
    } else{
        res.render("treatment",data = {succ: null,user:req.session.userid.user});
    }
}

const about_us = (req,res)=>{
    if(req.session.update_data){
        res.render("about_us",data = {succ: null,user:req.session.update_data});
    } else{
        res.render("about_us",data = {succ: null,user:req.session.userid.user});
    }
}

const tvastra_plus = (req,res)=>{
    if(req.session.update_data){
        res.render("tvastra_plus",data = {succ: null,user:req.session.update_data});
    } else{
        res.render("tvastra_plus",data = {succ: null,user:req.session.userid.user});
    }
}

const submit_your_query = (req,res)=>{
    if(req.session.update_data){
        res.render("submit_your_query",data = {succ: null,user:req.session.update_data});
    } else{
        res.render("submit_your_query",data = {succ: null,user:req.session.userid.user});
    }
}

const faq = (req,res)=>{
    if(req.session.update_data){
        res.render("faq",data = {succ: null,user:req.session.update_data});
    } else{
        res.render("faq",data = {succ: null,user:req.session.userid.user});
    }
}

const doctor_profile = (req,res)=>{

    models.user_schema.findOne({ _id : req.query.id })
    .select({name : 1 ,_id : 1,specification:1,hospital:1,qualification:1,experience:1,city:1,fees:1,state:1,file:1,yourself:1,awards:1}) 

    .then(user =>{
        if(req.session.update_data){
            res.render("doctor_profile",data = {succ: null,user:req.session.update_data , doctor : user});
        } else{
            res.render("doctor_profile",data = {succ: null,user:req.session.userid.user , doctor : user});
        }
    })
    .catch(err =>{
        res.status(500).send({
            message : err.message || "Some error occurred while creating a create operation"
        });
    })

}

const book_appointment = (req,res)=>{
    if(req.session.update_data){
        res.render("book_appointment",data = {succ: null,user:req.session.update_data});
    } else{
        res.render("book_appointment",data = {succ: null,user:req.session.userid.user});
    }
}

const contact = (req,res)=>{
    if(req.session.update_data){
        res.render("contact",data = {succ: null,user:req.session.update_data});
    } else{
        res.render("contact",data = {succ: null,user:req.session.userid.user});
    }
}




const profile = (req,res)=>{


    if(req.session.update_profile){
        console.log("...........................,req.session.update_profile...",req.session.update_profile)
        var update_profile = req.session.update_profile;
        if(update_profile ==  req.session.update_profile){
            delete req.session.update_profile ;
            if(req.session.userid.user.type == "admin"){
                if(req.session.admin_update_data){
                    res.render("profile", data = { user: false ,succ : update_profile ,admin :req.session.admin_update_data }); // ,record: record
                }else{
                    res.render("profile", data = { user: false ,succ : update_profile ,admin :req.session.userid.user }); // ,record: record
                }
             }else{ 
                res.render("profile", data = { user: req.session.update_data ,succ : update_profile }); // ,record: record
             } 
        }
    }else{
        if(req.session.update_data){
            if(req.session.userid.user.type == "admin"){
                if(req.session.admin_update_data){
                    res.render("profile", data = { user: false ,succ : false ,admin :req.session.admin_update_data }); // ,record: record
                }else{
                    res.render("profile", data = { user: false ,succ : false ,admin :req.session.userid.user }); // ,record: record
                }
             }else{ 
                 res.render("profile", data = { user: req.session.update_data  }); 
             } 
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

        if(req.session.error_message){
            if(req.session.userid.user.type == "admin"){
                res. render("setting", data = {user: false ,  admin: req.session.update_data ,succ : req.session.error_message  });
            }else{
                res.render("setting", data = { user: req.session.update_data ,succ : req.session.error_message  });
            }
        }else{
            if(req.session.userid.user.type == "admin"){
                res. render("setting", data = {user: false ,  admin: req.session.userid.user  });
            }else{
                res.render("setting", data = { user: req.session.update_data  });
            }
        }

    }else{
        if(req.session.error_message){
            if(req.session.userid.user.type == "admin"){
                res. render("setting", data = { user: false , admin: req.session.userid.user ,succ : req.session.error_message });
            }else{
                res. render("setting", data = { user: req.session.userid.user ,succ : req.session.error_message });
            }
        }else{
            if(req.session.userid.user.type == "admin"){
                res. render("setting", data = {user: false ,  admin: req.session.userid.user  });
            }else{
                res. render("setting", data = { user: req.session.userid.user  });
            }
        }
    }
}

const show_record = (req,res)=>{

    var sec_var = req.session.record_responce ;
    delete req.session.record_responce ;

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
        profile:req.query.profile

    }
    console.log("main patientappointment obj ",obj ) ;

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
            res.render("admin", data = { succ: false , admin: req.session.admin_update_data , obj:obj } )
        }else{
            if(req.session.message && req.session.userid.count==0){
                req.session.userid.count = 1;
                // res.render("index",data = {succ: req.session.message.success , user: req.session.userid.user});
                res.render("admin", data = { succ: req.session.message.success , admin: req.session.userid.user , obj:obj } )
            }
            else{
                // res.render("index",data = {succ: null,user:req.session.userid.user});
                res.render("admin", data = { succ: false , admin: req.session.userid.user , obj:obj } )
            }
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
            patientdata.file = user[i].file ;

            userlist.push(patientdata) ;
        }

        if(req.session.admin_update_data){

            if(req.session.update_profile){
                var x = req.session.update_profile ;
                delete req.session.update_profile ;
                res.render("useradmin", data = { succ : x , admin : req.session.admin_update_data, userlist : userlist } )
            }else{
                res.render("useradmin", data = {  admin : req.session.admin_update_data, userlist : userlist } )
            }
        }else{

            if(req.session.update_profile){
                var x = req.session.update_profile ;
                delete req.session.update_profile ;
                res.render("useradmin", data = { succ : x , admin : req.session.userid.user , userlist : userlist } )
            }else{
                res.render("useradmin", data = {  admin : req.session.userid.user , userlist : userlist } )
            }
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
                res.render("profile", data = { user: user ,admin : req.session.userid.user  });
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
            patientdata.file = user[i].file ;

            userlist.push(patientdata) ;
        }
        console.log("user[0]",user[0])

        if(req.session.admin_update_data){

            if(req.session.update_profile){
                var x = req.session.update_profile ;
                delete req.session.update_profile ;
                res.render("doctoradmin", data = { succ : x , admin : req.session.admin_update_data, userlist : userlist } )
            }else{
                res.render("doctoradmin", data = {  admin : req.session.admin_update_data, userlist : userlist } )
            }
            

        }else{
            if(req.session.appocancel){
                var x = req.session.appocancel ;
                delete req.session.appocancel ;
                res.render("doctoradmin", data = { succ : x, admin : req.session.userid.user , userlist : userlist } )
            }else{
                if(req.session.update_profile){
                    var x = req.session.update_profile ;
                    delete req.session.update_profile ;
                    res.render("doctoradmin", data = { succ : x , admin : req.session.userid.user , userlist : userlist } )
                }else{
                  res.render("doctoradmin", data = {  admin : req.session.userid.user , userlist : userlist } )
                }
            }
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

const hospitaladmin = (req,res)=>{

    models.hospital_list.find()
    .then(user=>{
       
        if(req.session.admin_update_data){
            res.render("hospitaladmin", data = {  admin : req.session.admin_update_data, userlist : user } )
        }else{
            res.render("hospitaladmin", data = {  admin : req.session.userid.user , userlist : user } )
        }
    })
    .catch(err=>{
        res.send("/emaillogin");
    })
    
}

const hospitaladminform = (req,res)=>{
 
    var obj ={
        id: req.query.id,
        name: req.query.name ,
        bed: req.query.bed ,
        address: req.query.address ,
        speciality: req.query.speciality ,
        treatment: req.query.treatment ,
        discription: req.query.discription ,
        file: req.query.file 
    } 
    console.log("obj = ",obj) ;
    res.render("hospitaladminform", data = {  admin : req.session.userid.user , obj : obj } )
    
}

const cancelappointmentadmin = (req,res)=>{

    var docid = req.query.docid ;
    var docappoid = req.query.docappoid ;
    var userid = req.query.userid ;
    var userappointmentid = req.query.userappointmentid ;

    console.log(" docid ,docappoid ,userid ,userappointmentid ", docid ,            docappoid             ,userid             , userappointmentid) ;


    // var hulk = req.query.objid

    // console.log("...................... bookhospital ......hulk",hulk)
    
    models.user_schema.updateOne({"_id":userid},
                                 {$pull:{ "appointments":{"_id":ObjectID(`${userappointmentid}`)}}} )
    .then(user => {

        console.log(" cancelappointmentadmin 1 then")
        // {$set : {"schedule.$[s].slots.$[si].isbook": "false"} },
        // {arrayFilters : [{'s.schedule_index': req.query.scheduleid},{'si.id': parseInt(req.query.slotid)}] }

        models.user_schema.updateOne(
            { _id : docid}, 
            {$set : {"appointments.$[s].cancel": "cancel"} },
            {arrayFilters : [ {'s._id':ObjectID(`${docappoid}`)  } ]}
            ) 
            .then(user => {       
                    console.log(" cancelappointmentadmin 2 then")
                    req.session.appocancel = "appointment cancel succesfully" ;
                    res.redirect("/doctoradmin");
            })
            .catch(err => {
                console.log("..............................................catch 2",err)
                res.redirect("/emaillogin");
            })    
    })
    .catch(err => {
        console.log(".............................................catch 1 ",err)
        res.redirect("/emaillogin");
    })






}






module.exports = {
    emaillogin: emaillogin,
    signup: signup,
    show_user: show_user,
    home:home,
    otp: otp,
    otpnew:otpnew ,
    create_password:create_password,
    phone_login:phone_login,
    demodoc:demodoc,
    hospital:hospital,
    treatment:treatment,
    about_us:about_us,
    tvastra_plus:tvastra_plus,
    submit_your_query:submit_your_query,
    faq:faq,
    doctor_profile:doctor_profile,
    book_appointment:book_appointment,
    contact:contact,

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
    admindoctorallappointment:admindoctorallappointment,
    hospitaladmin:hospitaladmin,
    hospitaladminform:hospitaladminform,
    cancelappointmentadmin:cancelappointmentadmin

}




