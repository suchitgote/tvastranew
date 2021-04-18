
var models = require('../model/model');

// create and save new user
exports.create = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    // create new user
    const user = new models.Userdb({
        name : req.body.name,
        email : req.body.email,
        doctor : req.body.doctor
    })

    // save user in the database
    user
        .save(user)
        .then(data => {
          //res.send(data) 
          res.redirect('../demo_getdata')
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });
}

// retrieve and return all users/ retrive and return a single user
exports.find = (req, res)=>{
    if(req.query.id){
        const id = req.query.id;
        models.Userdb.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " + id})
            })
    }else{
        models.Userdb.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    
}

//...............................create and save new user.................................................................

exports.create_user = (req,res)=>{
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
          //res.send(data) 
          res.redirect('../show_user')
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });
}
//............................... retrieve and return all users/ retrive and return a single user................................................................

exports.show_user = (req, res)=>{
    if(req.query.id){
        const id = req.query.id;
        models.user_schema.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " + id})
            })
    }else{
        models.user_schema.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    
}

//............................... retrieve and return all users/ retrive and return a single user................................................................

exports.email_login = (req, res)=>{

 models.user_schema.find({"email":req.body.email})
    .then(user => {
        console.log(user[0].email,user[0].password);
        if(user[0].password == req.body.password ){
            console.log("password is correct")
            res.redirect("/")

        }else{
            console.log("password is not correct")
            res.redirect("/email_login")

        }
    })
    .catch(err => {
        res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
    })
}
