var express = require('express');
var mysql = require('mysql');
var bodyParser  = require("body-parser");
var app = express();

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
    // Find count of users in DB
    let q = "SELECT COUNT(*) AS count FROM emails";
    connection.query(q, function(err, results){
        if(err) throw err;
        let count = results[0].count; 
        res.render("home", {count: count});
    });
});

app.get("/registered", function(req, res){
    // Get the username of whoever registered
    let q = "SELECT user_name AS person FROM emails ORDER BY user_id DESC LIMIT 1";
    connection.query(q, function(err, results){
        if(err) throw err;
        let person = results[0].person; 
        res.render("registered", {person: person});
    });
});


app.post("/register", function(req, res){
    var person = {
        user_name: req.body.userName,
        user_email: req.body.userEmail
    };
    connection.query('INSERT INTO emails(user_name, user_email) VALUES (?,?)', [person.user_name, person.user_email], function(err, result) {
        if (err) {
            console.log(err);
        }
        res.redirect("/registered");
    });
});

app.listen(6969, function(){
    console.log("Server running on 6969!");
});