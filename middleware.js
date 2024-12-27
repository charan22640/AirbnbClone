const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Save the current URL to redirect after login
        req.flash("error_msg", "You must be logged in");
        return res.redirect("/login");
    }
    next(); // Proceed to the next middleware or route handler
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Make the redirect URL available to templates
    }
    next(); // Continue to the next middleware or route handler
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    
    try {
        const listing = await Listing.findById(id);

        // Handle the case where the listing doesn't exist
        if (!listing) {
            req.flash("error_msg", "Listing not found.");
            return res.redirect("/listings");
        }

        // Check if the logged-in user is the owner of the listing
        if (!listing.owner.equals(req.user._id)) {
            req.flash("error_msg", "You don't have access to modify this listing.");
            return res.redirect(`/listings/${id}`);
        }

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error("Error in isOwner middleware:", err);
        req.flash("error_msg", "An error occurred.");
        res.redirect("/listings");
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id, reviewid } = req.params;

    try {
        const foundReview = await Review.findById(reviewid);

        // Handle the case where the review is not found
        if (!foundReview) {
            req.flash("error_msg", "Review not found.");
            return res.redirect(`/listings/${id}`);
        }

        // Check if the logged-in user is the author of the review
        if (!foundReview.author.equals(req.user._id)) {
            req.flash("error_msg", "You are not the author of this review.");
            return res.redirect(`/listings/${id}`);
        }

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error("Error in isAuthor middleware:", err);
        req.flash("error_msg", "An error occurred.");
        res.redirect(`/listings/${id}`);
    }
};
