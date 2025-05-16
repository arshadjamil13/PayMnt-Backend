const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://arshadjamil13062003:ArshadJamil13@paymentcluster.gf4tc8s.mongodb.net/")

const UserSchema = new mongoose.Schema({
    username :{
        type: String ,
        required : true ,
        unique :true ,
        maxLength : 30 ,
        minLength :3
    },
    password :{
        type:String ,
        required: true ,
        minLength : 6
    },
    firstname:{
        type:String ,
        required: true ,
        trim :true ,
        maxLength : 50 ,
    },
    lastname:{
        type:String ,
        required: true ,
        trim :true ,
        maxLength : 50 ,
    }
})


const AccountSchema = new mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId ,
        ref: "User" ,
        required : true
    },
    balance :{
        type: Number,
        required : true
    }
})


const User  = mongoose.model("User" , UserSchema)
const Account  = mongoose.model("Account" , AccountSchema)
module.exports=({
   User,
   Account
})