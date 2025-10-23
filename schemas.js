const Joi = require('joi');

const campgroundSchema = Joi.object({
  camp: Joi.object({   // Make sure this matches the form name in your HTML
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required()
  }).required(),
  deleteImages: Joi.array()
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    body: Joi.string().required()
  }).required()
});

module.exports = { campgroundSchema, reviewSchema };
