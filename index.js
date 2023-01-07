const jwt= require("jsonwebtoken");
const express = require('express');
const mongoose = require('mongoose');
const users= require('./model');
const middleware =require("./middleware");
const statused=require("./statused")
const cors=require("cors")
const app = express();

mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://akhila:akhila@cluster0.rn7zzmo.mongodb.net/?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    ()=>console.log('DB Connected')
)
app.use(express.json())
app.use(cors({origin:"*"}))
app.post('/register',async(req,res)=>{
   
    try{
        const {name,phonenumber,age,pincode,password,confirmpassword,adharno} = req.body;
        const exist=await users.findOne({phonenumber});
        if(exist){
            return res.status(400).send("user already exists")
        }
        if (password!==confirmpassword){
            return res.status(403).send("password not matched")
        }
        let newUser=new users({name,phonenumber,age,pincode,password,confirmpassword,adharno})
         newUser.save();

        return res.status(200).send("user created");
    }
    catch(err){
        console.log(err)
        return res.status(500).send("server error")
    }
})
app.post("/login",async(req,res)=>
{try{
    const {phonenumber,password}=req.body;
    const exist=await users.findOne({phonenumber});
    if(!exist){
        return res.status(400).send("user not exists")
    }
    if (exist.password!=password){
        return res.status(400).send("password invalid")
    }
    let payload={
        user:{
            id:exist.id
        }
    }
    jwt.sign(payload,'jwtPassword',{expiresIn:720000000}
        ,(err,token)=>{
            if(err)throw err
            return res.json({token})
        }
    )
}catch(err){console.log(err);
    return res.status(500).send("server error")}})
    app.get("/allprofiles",middleware ,async(req,res)=>{
        try{
            let allprofiles=await users.find(); 
            return  res.json(allprofiles);
        }
        catch(err){console.log(err);
            return res.status(500).send("server error")}
    })
    app.get("/myprofile",middleware ,async(req,res)=>{
        try{
            let user=await users.findById(req.user.id); 
            return  res.json(user);
        }
        catch(err){console.log(err);
            return res.status(500).send("server error")}
    })
    app.post("/addstatus",middleware ,async(req,res)=>{
        const{admin,status}=req.body
        const exist= await users.findById(req.user.id);
        try{
            let newStatus=statused({
                user:exist.name,
                userid:exist.id,
                admin,status
    
            })
            newStatus.save();
            return res.status(200).send("review added")
        }
        catch(err){console.log(err);
            return res.status(500).send("server error")}
    })
    app.get("/userstatus",middleware ,async(req,res)=>{
        try{
            let allstatus=await statused.find(); 
            let myreviews=allstatus.filter(review=>review.userid.toString()===req.user.id.toString());
            return res.status(200).json(myreviews)
        }
        catch(err){console.log(err);
            return res.status(500).send("server error")}}
    )
    app.get("/adminstatus",middleware ,async(req,res)=>{
        try{
            let allstatus=await statused.find(); 
            let myreviews=allstatus.filter(review=>review.admin.toString()===req.user.id.toString());
            return res.status(200).json(myreviews)
        }
        catch(err){console.log(err);
            return res.status(500).send("server error")}}
    )
app.listen(5000,()=> console.log('Server running...'));