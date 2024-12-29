const Listing = require("../models/listing");
const Review = require("../models/review");
const mongoose = require('mongoose');

module.exports.index = async (req, res) => {
    try {
        let { categories } = req.query;
        categories = categories ? categories.split(',') : [];
        
        let query = {}; // Default: no filter
        if (categories.length > 0) {
          query.categories = { $in: categories };
        }
        
        const alllistings = await Listing.find(query);

        // Get all unique categories from the listings
        let allCategories = [...new Set(alllistings.flatMap(list => list.categories))];

        // Render the index page with filtered listings and all available categories
        res.render("listings/index.ejs", { 
            alllistings, 
            allCategories,
            curruser: req.user || null  // Manually pass curruser
        });

    } catch (err) {
        req.flash('error_msg', "Failed to load listings.");
        res.redirect("/listings");
    }
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs", { curruser: req.user || null });  // Pass curruser here too
};

module.exports.postNewForm = async (req, res) => {
    try {
        let { title, description, price, location, country, categories } = req.body;
        if (!title || !description || !price) {
            req.flash('error_msg', "All fields are required. Please provide valid data."); // Specific error message
            return res.redirect("/listings/new"); // Redirect to the form
        }

        const newListing = new Listing({
            title,
            description,
            price,
            location,
            country,
            categories,
            image: {
                filename: req.file.filename,
                url: req.file.path || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz0P7Hc-KEeZ2S6WC_INBHTHqmC83WAPBI5A&s",
            }
        });
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash('success_msg', "New Listing Added");
        console.log("New listing created:", newListing);
        res.redirect("/listings");
    } catch (err) {
        req.flash('error_msg', "Failed to create the listing.");
        res.redirect("/listings/new");
    }
};

module.exports.findListingById = async (req, res) => {
    try {
        let { id } = req.params;

        // Check if the id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const query = req.query.q ? req.query.q.trim() : '';
            const alllistings = await Listing.find({
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } }
                ]
            });

            if (alllistings.length === 0) {
                req.flash('error_msg', "No listings found for your search.");
                return res.redirect("/listings");
            }

            return res.render("listings/index.ejs", { 
                alllistings, 
                curruser: req.user || null  // Manually pass curruser
            });
        }

        // If id is a valid ObjectId, find the listing
        const item = await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");

        if (!item) {
            req.flash('error_msg', "The listing you are searching for is not found.");
            return res.redirect("/listings");
        }

        res.render("listings/view.ejs", { 
            item, 
            curruser: req.user || null  // Manually pass curruser
        });
    } catch (err) {
        console.error("Error loading listing:", err);
        req.flash('error_msg', "Failed to load the listing.");
        res.redirect("/listings");
    }
};

module.exports.editListing = async (req, res) => {
    try {
        let { id } = req.params;
        const item = await Listing.findById(id);
        
        if (!item) {
            req.flash('error_msg', "Listing not found.");
            return res.redirect("/listings");
        }
        
        res.render("listings/edit.ejs", { item, curruser: req.user || null });
    } catch (err) {
        req.flash('error_msg', "Failed to load the edit form.");
        res.redirect("/listings");
    }
};

module.exports.updateListing = async (req, res) => {
    try {
        let { id } = req.params;
        let { title, description, price, location, country, image, categories } = req.body;
      
        let updatedListing = await Listing.findByIdAndUpdate(id, {
            title,
            description,
            price,
            location,
            country,
            categories: categories || []
        }, { new: true });

        if (typeof req.file !== "undefined") { 
            let url = req.file.path;
            let filename = req.file.filename;
            updatedListing.image = { url, filename };
            await updatedListing.save();
        }

        if (!updatedListing) {
            req.flash('error_msg', "Failed to update listing. Listing not found.");
            return res.redirect("/listings");
        }

        req.flash('success_msg', "Listing Updated");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        req.flash('error_msg', "Failed to update the listing.");
        res.redirect(`/listings/${id}/edit`);
    }
};

module.exports.deleteListingById = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id).populate('reviews');
        if (!listing) {
            req.flash("error_msg", "Listing not found");
            return res.redirect("/listings");
        }

        if (listing.reviews && listing.reviews.length > 0) {
            await Review.deleteMany({ _id: { $in: listing.reviews } });
        }

        await Listing.findByIdAndDelete(id);
        req.flash("success_msg", "Listing Deleted");
        res.redirect("/listings");

    } catch (err) {
        req.flash("error_msg", "Failed to delete the listing.");
        res.redirect("/listings");
    }
};
