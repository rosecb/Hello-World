/*
Author: Rose Bautista
Date due: 11/19/2020
File Description: Javascript Server
*/
//server 

// many of this came from lab 13 or 14.
var express = require('express'); // express package
var app = express(); // starts express
var myParser = require("body-parser");
var products = require("./public/product_data.js");
var querystring = require("querystring");
fs = require('fs'); //Use the file system module 
var filename = 'user_data.json';

// from lab 13
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});

app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) {
    console.log('inprocessform');
    let POST = request.body;
    //validate quantity data before sending to invoice
    var hasValidQuantities = true; 
    var hasPurchases = false; 
    for (i = 0; i < products.length; i++) { 
         q = POST['quantity' + i]; 
         if (isNonNegInt(q) == false) { 
             hasValidQuantities = false; 
         }
         if (q > 0) { 
             hasPurchases = true; 
         }
     }
    //ok all good 
    qString = querystring.stringify(POST); //Stringing the query together, from prof port zoom meeting
    if (hasValidQuantities == true && hasPurchases == true) { 
        response.redirect("./login.html?" + qString); // change from invoice to login page
    }
    else { 
        response.redirect("./products_display.html?" + qString); // change errors.html to products_display.html
    }
});
 

// function that returns errors
// function that returns errors
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (q == "") { q = 0; }
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
 }


// many of this came from lab 14. adapted to suit this assignment 2.

//gets already existing registration data from the JSON file (Opens file only if it exists)
app.use(myParser.urlencoded({ extended: true }));
if (fs.existsSync(filename)) {
    stats=fs.statSync(filename) 
    //gets the stats of your file
  
    data=fs.readFileSync(filename, 'utf-8'); 
    //Reads the file and returns back with data and then continues with code as requested.

    users_reg_data = JSON.parse(data); 
    //Parses data in order to turn string into an object
} 

//GETS TO LOGIN PAGE
// adapted from lab 14 but changed so it matches the input fields for assignment 2.

app.post("/login.html", function (request, response) {
// the following was adapted from lab 14, changed up to suit this assignment
// Process login form POST and redirect to custom invoice page if ok, back to login page if not
    console.log(request.body, "worked");
    var qstring = querystring.stringify(request.query);
    //Makes username case insensitive
    the_username = request.body.username.toLowerCase(); //makes username case insensitive
    console.log(the_username, "Username is", typeof (users_reg_data[the_username]));
    
    //Validate login data
    if (typeof users_reg_data[the_username] != 'undefined') {
        //Asking object if it has matching username, if it doesnt itll be undefined.
        //If username is define ask for matching password
        if (users_reg_data[the_username].password == request.body.password) {
            //Diagnostic
            console.log("Successful login", request.query);
            //If login is vaild save name and data and send to invoice to make custom invoice
            request.query.InvoiceName = users_reg_data[the_username].name;
            qstring = querystring.stringify(request.query);
            qstring += '&Username=' + request.body.username; // from the meeting with port after tuesday's class
            response.redirect("./invoice.html?" + qstring);
            }
            error = "Invalid Password";
        }
        else {
            error = the_username + " Username does not exist";
    
        }
        //Give you error message alert if password or username is flawed.
        // somewhat adapted from lab 14 extra credit.
        request.query.LoginError = error;
        //Used to make login sticky so you dont have to retype it everytime you get the password wrong
        request.query.StickyLoginUser = the_username;
        qstring = querystring.stringify(request.query);
        response.redirect("./login.html?" + qstring); // back to login if the user makes a mistake on the login
    });
 

// for the registration form 
// the following is the input fields needed for assignment 2
    // Username: (a) This should have a minimum of 4 characters and maximum of 10 characters. (b) Only letters and numbers are valid. (c) Usernames are CASE INSENSITIVE. (d) They must be unique. There may only be one of any particular username. Because of this, you will have to find a way to check the new username against the usernames saved in your file.
    // Password: (a) This should have a minimum of 6 characters. (b) Any characters are valid. (c) Passwords are CASE SENSITIVE. That is, “ABC” is different from “abc”.
    // Confirm password: (a) Should make sure that it is the same as the password.
    // mail address: (a) The format should be X@Y.Z where (b) X is the user address which can only contain letters, numbers, and the characters “_” and “.” (c) Y is the host machine which can contain only letters and numbers and “.” characters (d) Z is the domain name which is either 2 or 3 letters such as “edu” or “tv”. (e) Email addresses are CASE INSENSITIVE.
    // Full Name The users full name. Should only allow letters. No more than 30 characters.
// i put this here as a quick reference when doing the validation code (more easier to reference from)!

//Validates data in registration form and sends you to  if data is valid, if not it sends you back to register page with errors

app.post("/register", function (request, response) {
    let INFO = request.body;
    //Makes the username case-insensitive
    username = INFO.Username.toLowerCase();
    
    console.log(request.query.user_errors);
    //Used to store errors, gonna put the errors in a string that gets loaded when you redirect back to registration page
    // from registration.html
    user_errors = {};
    name_errors = {};
    pass_errors = {};
    confirm_pass_errors = {};
    email_errors = {};

    // create error 
    haserrors = false;

    // validates the registration data
    console.log(INFO, "Here is the account info");

    // validate username (see above to see the input fields needed)
    if (typeof users_reg_data[username] != 'undefined') {
        user_errors.UsernameError = "Taken";
        haserrors = true;
    }
    if (/[^a-zA-Z0-9]/.test(username)) {
        // found this info through this website 
        // https://docs.netapp.com/oci-73/index.jsp?topic=%2Fcom.netapp.doc.oci-acg%2FGUID-452051E1-0F8B-415E-87FE-D8AD97881072.html 
        user_errors.UsernameError = "Alpha-Numeric only and No spaces";
        haserrors = true;
    }
    if (username.length > 10) {
        user_errors.UsernameError = "Username is too long";
        haserrors = true;
    }
    if (username.length < 4) {
        user_errors.UsernameError = " Username is too short";
        haserrors = true;
    }
    if (username.length < 1) {
        user_errors.UsernameError = "Please do not leave empty!";
    }

    // validate password and confirm password (see above to see the input fields needed)
    if (INFO.Pass.length < 6) {
        pass_errors.PassError = "Password too short";
        haserrors = true;
    }
    if (INFO.Pass.length < 1) {
        pass_errors.PassError = "Please do not leave empty";
        haserrors = true;
    }
    if (INFO.ConfirmPass != INFO.Pass) {
        confirm_pass_errors.ConfirmPassError = "Passwords don't match";
        haserrors = true;
    }
    if (INFO.ConfirmPass.length < 1) {
        confirm_pass_errors.ConfirmPassError = "Please do not leave empty!";
        haserrors = true;
    }

    // validate email input
    // found this info through this website
    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(INFO.Email)) {
    } else {
        email_errors.EmailError = "Invalid email address";
        haserrors = true;
    }
    if (INFO.Email.length < 1) {
        email_errors.EmailError = "Please do not leave empty!";
        haserrors = true;
    }

    //Turn errors object into strings so they can be input to URL.
    user_errors_string = JSON.stringify(user_errors.UsernameError);
    name_errors_string = JSON.stringify(name_errors.NameError);
    pass_errors_string = JSON.stringify(pass_errors.PassError);
    confirm_pass_errors_string = JSON.stringify(confirm_pass_errors.ConfirmPassError);
    email_errors_string = JSON.stringify(email_errors.EmailError);

    //If valid turn form values into an object that is saved and stored in JSON file
    //Activate error flag
    if (haserrors == false) {
        users_reg_data[username] = {};
        users_reg_data[username].name = INFO.Name;
        users_reg_data[username].password = INFO.Pass;
        users_reg_data[username].email = INFO.Email;
        console.log(users_reg_data[username]);

        fs.writeFileSync(filename, JSON.stringify(users_reg_data));

        var qstring = querystring.stringify(request.query);

        console.log(users_reg_data, "Yay");
        
        // takes you to the invoice after registration data has been validated
        request.query.InvoiceName = INFO.Name;
        
        // inputs command to display successful registration before going to invoice page
        request.query.SucessfulReg = "Registration Sucessful!";

        request.query.InvoiceName = users_reg_data[the_username].name;
        qstring = querystring.stringify(request.query);
        qstring += '&Username=' + request.body.username; // from meeting after tuesday lab but doesn't seem to work ... 
        // adapted from lab 
        response.redirect("./invoice.html?" + qstring);
    } else {
        //If not valid add Errors string to query so they can be displayed on page
        // adapted from lab 14.
        request.query.StickyUser = INFO.Username;
        request.query.StickyName = INFO.Name;
        request.query.StickyEmail = INFO.Email;
        request.query.user_errors = user_errors_string;
        request.query.name_errors = name_errors_string;
        request.query.pass_errors = pass_errors_string;
        request.query.confirm_pass_errors = confirm_pass_errors_string;
        request.query.email_errors = email_errors_string;

        qstring = querystring.stringify(request.query);

        // input errors into new registration URL query so they can be used to display errors
        response.redirect("/registration.html?" + qstring);

    }
});

app.use(express.static('./public')); //set up a static route
app.listen(8080, () => console.log(`listening on port 8080`));
