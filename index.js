const express = require("express")
const app = express()
const mongoose = require("mongoose")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
// const Listing = require("./models/listings.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
// const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
// const {listingSchema, reviewSchema} = require("./schema.js")
const port = 8080
// const Review = require("./models/review.js")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

const listingRouter = require("./routes/listings.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "/public")))

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
})

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.engine("ejs", ejsMate);

main().then((res)=>{
    console.log("Connected to db")
}).catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(MONGO_URL)
}

app.get("/",(req,res)=>{
    res.send("Hello")
})

app.get("/demoUser", async (req,res)=>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student"
    })
    let registeredUser = await User.register(fakeUser, "helloworld")
    res.send(registeredUser)
})

app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)

app.all("*", (req,res,next)=>{
    next(new ExpressError(404, "Page Not Found"))
})

app.use((err, req, res, next)=>{
    let {statusCode, message} = err
    res.render("listings/error.ejs", {err})
})

app.listen(port, ()=>{
    console.log("listening on port 8080")
})