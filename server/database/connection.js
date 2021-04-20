// const uri = "mongodb+srv://Tvastra:sgoc.2030@cluster0.w2dnb.mongodb.net/Tvastra?retryWrites=true&w=majority";

const mongoose = require('mongoose');
 const url = "mongodb+srv://admin:admin123@cluster0.rztbg.mongodb.net/userdb?retryWrites=true&w=majority"
const connectDB = async () => {
    try{
        // mongodb connection string
        const con = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log(`MongoDB connected : ${con.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB ;

