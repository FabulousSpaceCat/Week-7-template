var express = require('express');
var mysql = require('mysql');
var bodyParser  = require("body-parser");
var app = express();
const { check, validationResult } = require("express-validator");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'users',
  password : 'root'
});

app.get("/", function(req, res){
    // Insert info if we've returned by way of error
    let person = "";
    if (req.query.name != "" && req.query.name != undefined) {
        person = {
            user_name: req.query.name,
            user_email: req.query.email
        };
    }
    // Find count of users in DB
    let q = "SELECT COUNT(*) AS count FROM emails";
    connection.query(q, function(err, results){
        if(err) {
            console.log(err)
        };
        let count = results[0].count; 
        res.render("home", {count, person});
    });
});

app.get("/registered", function(req, res){
    // Get the username of whoever registered last
    let q = "SELECT ?? AS ? FROM emails ORDER BY ?? DESC LIMIT 1";
    connection.query(q, ["user_name", "person", "user_id"], function(err, results){
        if(err) {
            console.log(err)
        };
        let person = results[0].person; 
        res.render("registered", {person});
    });
});

app.get("/naughty", function(req, res){
    // Get the name of the greedy cookie thief
    let person = req.query.name;
    res.render("naughty", {person});
});

app.post("/register", [
    check("userName")
        // Remove excess whitespace so we can see if we got only spaces
        .trim()
        // Name can't be just empty
        .notEmpty().withMessage("I think it had to do with your name, you didn't write anything down!")
        // If err, kick the user out to fix it
        .bail()
        // Matches letters spaces hyphens and apostrophes, including unicode characters for people with accents in their names
        .matches(/^[^-']([a-zA-ZÀ-ÖØ-öø-ÿ '-](?!.*''|--|  |- |' | '| -.*))+$/, 'g').withMessage("I think it had to do with your name, which should start with a letter, and may only contain letters with spaces, hyphens, and apostrophes.")
        // If err, kick the user out to fix it
        .bail()
        // Match the length of the database column
        .isLength( { min:2, max:20 }).withMessage("I think it had to do with your name, which should only be between 2 and 20 characters long."),
    check("userEmail")
        // Same as before mostly, refer to html input attributes
        .trim()
        .notEmpty().withMessage("I think it had to do with your email address, you didn't write anything down!")
        .bail()
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'g').withMessage("I think it had to do with your email address, maybe it wasn't formatted correctly.  It should look something like this: email@address.com")
        .bail()
        .isLength( { min:5, max:50 }).withMessage("I think it had to do with your email address, which should only be between 5 and 50 characters long.")
    ], 
    (req, res) => {
        // Check our results
        let result = validationResult(req);
        // Stuff them in an object
        let errors = result.errors;  
        // Show me the errors in the console
        for (let key in errors) {
            console.log(errors[key].value);
        }
        // Set some variables, removing extra whitespace
        let person = {
            user_name: req.body.userName.trim(),
            user_email: req.body.userEmail.trim()
        };
        if (!result.isEmpty()) {
            // If errors, render the error page to try again
                res.render("error", { errors, person })
        }
        else {
            // Insert into database
            let q = "INSERT INTO emails(??, ??) VALUES (?,?)"
            connection.query(q, ["user_name", "user_email", person.user_name, person.user_email], (err, result) => {
                if (err) {
                    // If duplicate, redirect with query param
                    if (err.errno === 1062) {
                        res.redirect("/naughty?name=" + person.user_name);
                    }
                    // Or else just log it
                    else {
                    console.log(err);
                    }
                }
                // If all goes well, let's get them to the success page
                else {
                res.redirect("/registered");
                }
            });
        }
    }
);

// HTTP Errors
app.use((req, res) => {
    res.status(404).send("404: Page not Found");
});
app.use((req, res) => {
    res.status(500).send("500: Internal Server Error");
});
app.use((req, res) => {
    res.status(504).send("504: Gateway Timeout");
});
app.use((req, res) => {
    res.status(509).send("509: Bandwidth Limit Exceeded");
});

app.listen(6969, function(){
    console.log("Server running on 6969!");
});