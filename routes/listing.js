const express = require("express");
const router = express.Router();
const {isLoggedIn,isOwner,isAuthor}=require("../middleware.js")
const listingController=require("../controllers/listing.js")
const {storage}=require("../cloudconfig.js")
const multer=require("multer");
const Listing = require("../models/listing.js");
const upload=multer({storage})
 
// GET all listings
router.route("/")
.get( listingController.index)
.post(isLoggedIn, upload.single('listing[image]'),listingController.postNewForm);



// GET form to create a new listing
router.get("/new",isLoggedIn, listingController.renderNewForm);


// GET a single listing by ID
router.route("/:id")
.get(listingController.findListingById)
.delete(isLoggedIn,isOwner,listingController.deleteListingById);



// GET form to edit a listing
router.get("/:id/edit", isLoggedIn,isOwner,listingController.editListing);

// PATCH update a listing by ID
router.patch("/:id/save", isLoggedIn,isOwner,upload.single('listing[image]'),listingController.updateListing);

router.get("/search", async (req, res) => {
  const query = req.query.q ? req.query.q.trim() : ''; // Trimmed query to remove leading/trailing spaces
  console.log("Received search query:", query);

  if (!query) {
      req.flash("error_msg", 'Please enter a search term');
      return res.redirect("/listings");
  }

  try {
      const alllistings = await Listing.find({
          $or: [
              { title: { $regex: query, $options: "i" } },
              { description: { $regex: query, $options: "i" } }
          ]
      });

      if (alllistings.length === 0) {
          req.flash("error_msg", 'No listings found for the search term');
      }

      console.log("Search results:", alllistings); // Log the results
      res.render("listings/index.ejs", { alllistings });
  } catch (err) {
      console.error("Error during search:", err);
      req.flash("error_msg", "Something went wrong with the search.");
      res.redirect("/listings");
  }
});








module.exports = router;
