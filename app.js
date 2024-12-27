if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}



const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require('connect-flash');
const expressError = require("./utils/expressError.js"); // Make sure to import this if it's in use


app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const DB_URL = process.env.ATLAS_DB_URL;
const listingrouter = require("./routes/listing.js");
const reviewsrouter = require("./routes/review.js");
const userrouter=require("./routes/user.js")

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")

async function main() {
    try {
        await mongoose.connect(DB_URL);
        console.log("Connected to DB");
    } catch (err) {
        console.error("Database connection error:", err.message);
        process.exit(1); // Exit the process with an error code
    }
}

main();

const sessionOptions = {
    secret:process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + (1000 * 60 * 60 * 24 * 3), // calculated time in milliseconds
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    }
};

const store = MongoStore.create({
    mongoUrl: DB_URL,
    crypto: {
      secret: process.env.secret
    },
    touchAfter: 24 * 3600 // time period in seconds
  });
  store.on("error",()=>{
    console.log("error in mongo sessions store")
  })


app.use(session(sessionOptions));
app.use(flash());

//authorisation
app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// passport.use(new LocalStrategy(passport.authenticate()));
// User.authenticate() 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());








// -----------------------------------

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg'); // Corrected this line
     res.locals.curruser=req.user || null;
    next();
});



// app.get("/", (req, res) => {
//     res.send("working");
// });

app.use("/listings", listingrouter);
app.use("/listings/:id/reviews", reviewsrouter);
app.use("/", userrouter);

// app.use("/signup", userrouter);
// app.use("/login", userrouter);
app.all("*", (req, res, next) => {
    next(new expressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
});

app.listen(8080, () => {
    console.log("Server is listening");
});
