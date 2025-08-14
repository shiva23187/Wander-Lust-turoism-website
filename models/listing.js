const mongoose = require("mongoose");
const Review = require("../models/review.js");

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: { type: Number, min: 1 },
    location: String,
    country: String,
    category: {  // ✅ Category field
        type: String,
        enum: ["Trending","Room","Iconic Cities","Hostels","Guest House","Swimming Pools","Shops","Camping"],
        required: true
    },
    whatsapp: { type: String, required: false },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

// ✅ Fix OverwriteModelError
const Listing = mongoose.models.Listing || mongoose.model("Listing", listingSchema);

module.exports = Listing;
