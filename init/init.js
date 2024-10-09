const mongoose = require("mongoose")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
const initData = require("./data.js")
const Listing = require("../models/listings.js")

main().then((res)=>{
    console.log("Connected to db")
}).catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(MONGO_URL)
}

const init = async ()=>{
    await Listing.deleteMany({})
    Listing.insertMany(initData.data)
}

init()