const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport")

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        let {username,email,password} = req.body
        const newUser = new User({email,username})
        const registeredUser = await User.register(newUser, password)
        req.flash("success", "Welcome to WanderLust")
        res.redirect("/listings")
    } catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}))

router.get("/login", (req,res)=>{
    res.render("users/login.ejs")
})

router.post("/login", passport.authenticate("local", {failureRedirect: "/login", failuerFlash: true}), async(req,res)=>{
    req.flash("success", "Welcome back to WanderLust! You are logged in")
    res.redirect("/listings")
})

router.get("/logout", (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success", "You are logged out now")
        res.redirect("/listings")
    })
})

module.exports = router