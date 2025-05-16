const express = require("express")
const mongoose = require("mongoose");
const router = express.Router()
const {authmiddleware} = require("../middleware")
const {Account} = require("../Mongo")

router.get("/balance",authmiddleware ,async (req ,res) => {
        const account = await Account.findOne({
            userId : req.userId
        })
        res.json({
            balance : account.balance ,
            name : account.firstname
        })
})

router.post("/transfer",authmiddleware,async(req,res)=>{
    const session = await mongoose.startSession()
    session.startTransaction()

    const {amount ,to } = req.body
    const account = await Account.findOne({
        userId :req.userId
    }).session(session)

    if(!account || account.balance < amount){
        await session.abortTransaction()
        return res.json({
            message:"Insufficient Balance"
        })
    }

    const toAccount = await Account.findOne({
        userId : to
    }).session(session)

    if(!toAccount){
        await session.abortTransaction()
        return res.json({
            message :"Invalid Account"
        })
    }

    await Account.updateOne({
        userId : req.userId
    },{
        $inc:{
            balance : -amount 
        }
    }
    ).session(session)

    await Account.updateOne({
        userId : to
    },{
        $inc:{
            balance : amount 
        }
    }
    ).session(session)

    await session.commitTransaction()
    res.json({
        message : "Fund Transfer Successfully"
    })
})
module.exports = router