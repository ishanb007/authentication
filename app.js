//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// const md5 = require("md5");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//to encrypt password
//userSchema.plugin(encrypt, {secret:process.env.SECRET , encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);


app.get("/", function (req,res){
    res.render("home");
});

app.route("/register")

.get(function (req,res){
    res.render("register");
})
.post(function(req,res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password:hash
        });
        newUser.save().then(()=>{
            res.render("secrets");
          }).catch((err)=>{
            console.log(err);
          });
    });
});

app.route("/login")
.get(function (req,res){
    res.render("login");
})
.post(async function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    await User.findOne({email: username}).exec().then((foundItem)=>{
        bcrypt.compare(password, foundItem.password, function(err, result) {
            res.render("secrets");
        });
    }).catch((err)=>{
        console.log(err);
    })
});



app.listen(3000, function() {
    console.log("Server started on port 3000");
  });