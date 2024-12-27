const express = require("express");
const router = express.Router({ mergeParams: true }); // Ensures merging of params from parent route
const reviewController = require("../controllers/reviews");
const { isLoggedIn, isAuthor } = require("../middleware");

// POST to add a review to a listing
router.post("/", isLoggedIn, reviewController.addReview);

// DELETE to delete a review from a listing
router.delete("/:reviewid", isLoggedIn, isAuthor, reviewController.deleteReview);

module.exports = router;
