const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// Show all listings with search & category filter
module.exports.Index = async (req, res) => {
    try {
        const { q, category } = req.query; // search query & category filter
        let filter = {};

        // Search by location
        if (q) {
            const regex = new RegExp(q.trim(), "i"); // case-insensitive
            filter.location = regex;
        }

        // Filter by category
        if (category && category !== "All") {
            filter.category = category;
        }

        const listings = await Listing.find(filter);
        res.render("listings/allListings", { allListings: listings, searchQuery: q, selectedCategory: category || "All" });
    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to load listings.");
        res.redirect("/");
    }
};

// Show form to create a new listing
module.exports.renderNewForm = (req, res) => {
    res.render("listings/newListing");
};

// Create a new listing
module.exports.newListingCreate = async (req, res) => {
    try {
        const listing = new Listing(req.body.listing);
        listing.owner = req.user._id;
        if (req.file) {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }
        await listing.save();
        req.flash("success", "Successfully created a new listing!");
        res.redirect("/listings");
    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to create listing. Please try again.");
        res.redirect("/listings/newListing");
    }
};

// Show a single listing
module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("reviews");
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
};

// Show edit form
module.exports.editListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
};

// Update a listing
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    await listing.save();
    req.flash("success", "Successfully updated listing!");
    res.redirect(`/listings/${listing._id}`);
};

// Delete a listing
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted listing!");
    res.redirect("/listings");
};
