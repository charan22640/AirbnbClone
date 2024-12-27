const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.addReview = async (req, res) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error_msg", "Listing not found.");
            return res.redirect("/listings");
        }

        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;

        await newReview.save();
        listing.reviews.push(newReview._id);
        await listing.save();

        req.flash("success_msg", "Review added successfully.");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        req.flash("error_msg", "Failed to add the review.");
        res.redirect(`/listings/${id}`);
    }
};










module.exports.deleteReview = async (req, res) => {
    try {
        let { id, reviewid } = req.params;

        console.log("Attempting to delete review:", reviewid);

        // Find the listing by ID and populate the reviews field
        let listing = await Listing.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'author',  // Populate author if needed
                model: 'User'
            }
        });

        if (!listing) {
            console.log("Listing not found.");
            req.flash("error_msg", "Listing not found.");
            return res.redirect("/listings");
        }

        // Delete the review and remove it from the listing's reviews array
        await Review.findByIdAndDelete(reviewid);
        listing.reviews.pull(reviewid);
        await listing.save();

        console.log("Review deleted successfully.");
        req.flash("success_msg", "Review deleted successfully.");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        req.flash("error_msg", "Failed to delete the review.");
        res.redirect(`/listings/${id}`);
    }
};

