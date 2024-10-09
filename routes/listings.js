const express = require("express")
const Listing = require("../models/listings.js")
const wrapAsync =  (fn) => {
    return function(req,res,next){
        fn(req, res, next).catch(next)
    }
}
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("../schema.js")
const router = express.Router()
const {isLoggedIn} = require("../middleware.js")

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        throw new ExpressError(400, error)
    } else{
        next()
    }
}


router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find()
    res.render("listings/index.ejs", {allListings})
}))

router.get("/new",isLoggedIn, (req,res)=>{
    
    res.render("listings/new.ejs")
})

// Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save()
    req.flash("success", "New Listing Created!")
    res.redirect("/listings")
}))

router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs", {listing})
}))

router.put("/:id",isLoggedIn, validateListing, wrapAsync(async (req,res)=>{
    let list = req.body
    let {id} = req.params
    await Listing.findByIdAndUpdate(id, {...req.body.listing})
    req.flash("success", "Listing Updated!")
    res.redirect("/listings")
}))

router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params
    let listing = await Listing.findById(id).populate("reviews")
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/show", {listing})
}))

router.delete("/:id", isLoggedIn, wrapAsync(async (req,res)=>{
    let {id} = req.params
    let data = await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings")
}))

module.exports = router