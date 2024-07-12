import express from 'express';
import {dirname} from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser'
import pg from 'pg';
import fs from 'fs'
import nodemailer from 'nodemailer'

const app=express()
const dir=dirname(fileURLToPath(import.meta.url))
app.listen(1000,()=>[
    console.log("Server Started")
])
app.use(bodyParser.urlencoded({extended:true}))
app.get("/",(req,res)=>{
    res.sendFile(dir+"/index.html")
})
var db=new pg.Client({
    user:'postgres',
    host:'localhost',
    port:2000,
    database:"Form",
    password:'sidhumoosewala'
})
db.connect()
app.post('/',(req,res)=>{
var name=req.body.name
var email=req.body.email
var password=req.body.password
db.query(`INSERT INTO form VALUES ('${name}','${email}','${password}')`,(err,res)=>{
    console.log(res)
})
var otp=Math.floor(Math.random() * 9999)+1;
fs.writeFile("otp.txt",otp.toString(),()=>{
    var transporter=nodemailer.createTransport({
        service:"outlook365",
        auth: {
            user:"manishlofat@outlook.com",
            pass:"Jasmehsidhu@123"
        }
    })
    const mail={
        from:"manishlofat@outlook.com",
        to:email,
        subject:"OTP authentication",
        text:`your OTP is ${otp}`
    }
    transporter.sendMail(mail,(err,info)=>{
if(err){
    console.log(err)
}
else{
    console.log(info.response)
}
    })
})
res.render('index.ejs')
})
app.post("/check",(req,res)=>{
    fs.readFile("otp.txt","utf8",(err,data)=>{
        if(parseInt(data)==parseInt(req.body.otp)){
              res.send("Verified")
        }
        else{
            res.send("Wrong OTP")
        }
    })
})