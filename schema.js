// schema.js
const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
        price: Joi.number().required().min(1),
        location: Joi.string().required(),
        country: Joi.string().required(),
        whatsapp: Joi.string()
            .pattern(/^[0-9]{10}$/) // must be 10 digits
            .allow("", null)        // allow empty if optional
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});
