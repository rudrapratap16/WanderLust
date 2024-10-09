const mongoose = require("mongoose")
const { listingSchema } = require("../schema")
const Review = require("./review.js")
const Schema = mongoose.Schema

const listings = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/swing-hang-on-coconut-tree-near-seashore-67sVPjK6Q7I",
        set: (v) => v==="" ? "https://unsplash.com/photos/swing-hang-on-coconut-tree-near-seashore-67sVPjK6Q7I" : v
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

listings.post("findOneAndDelete", async (listing)=>{
    if(listing)
    {
        Review.deleteMany({_id: {$in: listing.reviews}}) 
    }
})

const listing = mongoose.model("Listings", listings)

module.exports = listing