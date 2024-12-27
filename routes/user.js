const express=require("express")
const router=express.Router();
const User=require("../models/user.js")
const passport =require("passport")
const {saveRedirectUrl}=require("../middleware.js")
const userController=require("../controllers/user.js")

router.route("/signup")
.get(userController.signupPage)
.post( userController.postSignup);



router.route("/login")
.get(userController.loginPage)
.post(saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
   userController.postLogin
);


router.get("/logout", userController.logoutpage);




module.exports=router;
