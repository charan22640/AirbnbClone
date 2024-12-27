const User=require("../models/user")

module.exports.signupPage=(req,res)=>{

    res.render("users/signup.ejs")
}
module.exports.postSignup=async (req, res) => {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    try {
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, function(err) {
            if (err) { return next(err); }
            req.flash("success_msg", "Welcome to WanderLust!");
            res.redirect("/listings");  // Redirect to a new route after successful registration
          });
       
    } catch (err) {
        req.flash("error_msg", err.message);
        res.redirect("/signup");
         
    }
}

module.exports.loginPage= (req, res) => {
    res.render("users/login.ejs");
}
module.exports.postLogin= (req, res) => {
    req.flash("success_msg", "Logged in successfully!");
    console.log(req.user)
    res.redirect(res.locals.redirectUrl || "/listings");  // Redirect on successful login
}

module.exports.logoutpage=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success_msg", "You are logged out!");
        res.redirect("/listings");
    });
}