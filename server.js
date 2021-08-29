// Created by Sean Corcoran
// For SIT313 - Deakin University - 8/2021

const express = require("express");
const bodyParser = require("body-parser");
const config = require('config');
const mongoose = require("mongoose");
const Experts = require("./models/Experts.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();

// Middleware.
app.use(bodyParser.urlencoded({extended:true}));

// MongoDB connection string - add the username and password to the connection string.
const connectString = `mongodb+srv://${config.get('db.user')}:${config.get('db.password')}@sit313.crpv9.mongodb.net/SIT313?retryWrites=true&w=majority`;

// Connect to the DB. 
mongoose.connect(connectString, { useNewUrlParser: true, useUnifiedTopology: true });

// Default all route
app.route('/experts')

// Get and return a list of all the stored experts
.get( (req, res) => {
    Experts.find((err, expertsList) => {
        if (err) {res.send(err)}
        else {(res.send(expertsList))}
    });
})

// Post a new expert
.post( async (req, res) => {
    // Hash the password.
    req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(saltRounds));

    // Create the expert object.
    const expert = new Experts({
        email : req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password, 
        address: req.body.address,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        post_code: req.body.post_code,
        mobile: req.body.mobile
    });

    // Save to the DB. 
    expert.save((err) =>{
        if (err) {res.send(err)}
        else {(res.send(expert))} 
    });
})

// Remove all experts.
.delete((req, res) => {
    Experts.deleteMany((err) => {
        if (err) {res.send(err)}
        else res.send('Deleted all experts');
    });
});

// Specific expert functions (using the unique email as the id)
app.route('/experts/:id')

// Return the required expert.
.get((req, res) => {
    Experts.findOne({email: req.params.id}, (err, foundExpert) => {
        if (foundExpert) (res.send(foundExpert))
        else res.send('No Experts with the request ID')
    });
})

// Update different required items of the expert.
.patch( async (req, res) => {
    // If trying to update the password make sure to hash it to store the hash. 
    if (req.body.password)
    {
        req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(saltRounds));
    }
    
    // Update the required expert with the specified fields.
    const result = await Experts.updateOne(
        {email: req.params.id},
        {$set: req.body},
        (err) => {
            if (err) {res.send(err)}
        }
    );
    
    // Look up the expert that was just updated, return the newly updated expert as the result.
    Experts.findOne({email: req.params.id}, (err, foundExpert) => {
        if (foundExpert) (res.send(foundExpert))
        else res.send('Could not find updated expert')
    });
})

// Deleted the required expert
.delete((req, res) => {
    Experts.deleteOne({email: req.params.id}, (err) => {
        if (err) {res.send(err)}
        else res.send('Deleted required expert')
    });
});

// Open the port 
app.listen(process.env.PORT || 8000, ()=>{
    console.log('Server started on port 8000');
})