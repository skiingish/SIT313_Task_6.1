const mongoose = require("mongoose");
var emailValidator = require("email-validator");

const expertsSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, "Email can't be blank"],
            match: [/.+\@.+\..+/, "Not a vaild email address"],
            unique: [true, "Email already exists"],
            validate(value) {
                if (!emailValidator.validate(value)) {
                    throw new Error('Not a vaild email address');
                }
            }
        },
        firstname: {
            type: String,
            trim: true,
            required: [true, "First name can't be blank"] 
        },
        lastname: {
            type: String,
            required: [true, "Last name can't be blank"] 
        },
        password: {
            type: String,
            trim: true,
            required: [true, "Password can't be blank"],
            minLength: [8, "Password must be at least 8 characters"] 
        },
        address: {
            type: String,
            trim: true,
            required: [true, "Address can't be blank"] 
        },
        address2: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
            required: [true, "City can't be blank"] 
        },
        state: {
            type: String,
            trim: true,
            required: [true, "State can't be blank"] 
        },
        post_code: {
            type: Number,
            trim: true
        },
        mobile: {
            type: Number,
            trim: true
        }
    }
);

// Export the model.
module.exports = mongoose.model("Experts", expertsSchema);