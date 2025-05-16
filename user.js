const express = require("express")
const {checkSignup,checksignin ,updateBody}  = require("./typecheck")
const { User , Account} = require("../Mongo")
const jwt = require("jsonwebtoken")
const JWT_SECRET = require("../config")
const router = express.Router()
const {authmiddleware} = require("../middleware")

router.post("/signup" ,async function(req,res){
    const body = req.body
    const parsedBody = checkSignup.safeParse(body)
    if(!parsedBody.success){
        return res.json({
            message:"Incorrect Input"
        })
    }
    const ExistingUser =  await User.findOne({
        username: body.username
    })
    if(ExistingUser){
        return res.json({
            message:"Account Already Exists"
        })
    }

    const dbUser =await User.create({
        username : req.body.username ,
        password :req.body.password,
        firstname : req.body.firstname,
        lastname: req.body.lastname
    })

    await Account.create({
        userId : dbUser._id ,
        balance : 1 + Math.random() * 10000

    })

    const token = jwt.sign({
        userId : dbUser._id
    },JWT_SECRET)


    res.json({
        message : "User Created Succesfully" ,
        token : token
    })
})

router.post("/signin",async (req,res)=>{
    const body = req.body
    const parsedBody = checksignin.safeParse(body)
    if(!parsedBody.success){
        return res.json({
            message:"Incorrect Input"
        })
    }
    const ExistingUser =  await User.findOne({
        username: body.username ,
        password : body.password
    })

    if(!ExistingUser._id){
        return res.json({
            message :"Incorrect Id or Password"
        })
    }

    const token = jwt.sign({
        userId : ExistingUser._id
    },JWT_SECRET)


    res.json({
        token : token
    })


})

router.put("/update",authmiddleware ,async(req,res)=>{
    const {success} = updateBody.safeParse(req.body)
    if(!success){
        req.status(411).json({
            message:"Error While updating information"
        })
    }

    await User.updateOne(
        {_id : req.userId },
        req.body
    )

    res.status(200).json({
        message :"Updated Successfully" ,
        USERiD : req.userId
    })
})
router.get("/bulk",async(req,res)=>{
    const filter = req.query.filter || ""
    const users = await User.find({
        $or: [{
            firstname :{
                "$regex" : filter ,
                "$options": "i"
            }
            },{
            lastname : {
                "$regex" :filter ,
                "$options": "i"
            }
            }
        ]
    })

    res.json({
        user : users.map(user =>({
            username : user.username,
            firstname : user.firstname,
            lastname : user.lastname,
            _id :user._id
        }))
    })
})

module.exports = router