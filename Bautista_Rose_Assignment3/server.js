/*
Author: Rose Bautista
Date due: 12/18/2020
File Description: Javascript Server for Assignment 3
*/

/* on the assignment list "credit for use of other's code." 
credit to Alyssa Mencel's code,
I had to fix mines up and i found hers very helpful to fix the issues i had with naming
so shout out to her code i got from her github :)
*/

// all the const and var needed for the assignment
var data = require('./public/products.js'); //load the products file and setting it to variable data 
var productSelection = data.productSelection; //setting the variabel allProdcuts to the productSelection data in products.js
const queryString = require('query-string'); //using the query-string
var express = require('express'); //using the express module
var app = express(); //setting the variable app to express module 
var myParser = require("body-parser"); //using the body parser module
var fs = require('fs'); //using the fs module 

var userInfoFile = './user_data.json'; 
var userDataFile = fs.readFileSync(userInfoFile, 'utf-8'); 
userdata = JSON.parse(userDataFile); 

// all the things need to install in order for this to work
var cookieParser = require('cookie-parser'); //using the cookie-parser
var session = require('express-session'); //using the express-session module (sudo npm install express)
app.use(myParser.urlencoded({ extended: true })); //putting data in the body 
const nodemailer = require("nodemailer"); //using the node mailer module (sudo npm install nodemailer)

app.use(cookieParser()); 

//for all requests, it writes it in the console and then moves on
app.all('*', function (request, response, next) { 
    console.log(request.method + ' to ' + request.path); 
    next(); 
});

// generates an invoice from cart html
app.post("/generateInvoice", function (request, response) {
    cart = JSON.parse(request.query['cartData']); //this parses the cart 
    cookie = JSON.parse(request.query['cookieData']); //this parses the cookies 
    var theCookie = cookie.split(';');
    for (i in theCookie) {
        //function from stackoverflow.com
        function split(theCookie) { //split the cookie (before "=")
            var i = theCookie.indexOf("="); 

            if (i > 0)
                return theCookie.slice(0, i);//takes off the string after the =
            else {
                return "";
            }
        };

        var key = split(theCookie[i]); 

        //this sets the username to the variable infoUsername 
        if (key == ' username') {
            var infoUsername = theCookie[i].split('=').pop(); 
        };
        //sets the variable to email 
        if (key == ' email') { 
            var email = theCookie[i].split('=').pop(); 
        };

    }
    console.log(email);
    console.log(infoUsername);
    console.log(theCookie);

    /* creates a invoice based on the cart */

    str = 
    `<link rel="stylesheet" type="text/css" href="cart.css"/>
    <div class="topnav-centered"> 
    <div style="background-image: url('./images/sweden6.jpg');
    background-size: cover; height:500px; padding-top:100px;">
    <header><div class="home">Aesthete.</div></header>
    </div>
    <br>
    <a href="./login.html">Login</a>
    &nbsp;
    <a href="./register.html">Register</a>
    &nbsp;
    <a href="./kanken.html">Kanken</a>
    &nbsp;
    <a href="./archerandolive.html">Archer and Olive</a>
    &nbsp;
    <a href="./leuchtturm.html">Leuchtturm1917</a>
    &nbsp;
    <a href="./simplygilded.html">Simply Gilded</a>
    &nbsp;
    <a href="./tombow.html">Tombow</a>
    &nbsp;
    <a href="./putsonyeon.html">Put So Nyeon</a>
    &nbsp;
    <a href="./hobonichi.html">Hobonichi</a>
    &nbsp;
    <a href="./cart.html">Shopping Cart</a>
    </div>

    <h3 align="center">Thank you for your purchase!</font><br>An email copy has been sent to <font color="#629DD1">${email}</font></h3>

    <section id="one" class="wrapper style1">
        <table>
        <tbody>
        <tr>
            <td style="text-align: left;" width="40%"><strong>Product</strong></td>
            <td width="20%"><strong>Quantity</strong></td>
            <td width="20%"><strong>Price</strong></td>
            <td width="20%"><strong>Extended Price</strong></td>
        </tr>`;

            subtotal = 0; //subtotal starts off as 0
            for (product in productSelection) {
                for (i = 0; i < productSelection[product].length; i++) {

                    qty = cart[`${product}${i}`];
                    if (qty > 0) { //if a quantity is entered in the textbox 
                        extended_price = qty * productSelection[product][i].price //equation for extended price
                        subtotal += extended_price; //adds each subtotatl to get the the extrended price 

                        str+=`
                        <tr>
                            <td style= "text-align: left" width="40%">${productSelection[product][i].name}</td>
                            <td width="20%">${qty}</td>
                            <td width="20%">\$${productSelection[product][i].price}</td>
                            <td  width="20%">\$${extended_price.toFixed(2)}</td>
                        </tr>
                    `;
                    }
                };
            }
            //compute tax information
            var tax_rate = 0.0471;
            var tax = tax_rate * subtotal; 
            // Compute shipping
            if (subtotal <= 50) {
                shipping = 2;
                }
             else if (subtotal <= 100) {
              shipping = 5;
            }
             else {
              shipping = 0.05 * subtotal; // 5% of subtotal
              }
            // Compute grand total
              var total = subtotal + tax + shipping;
            
              str+=`
              <tr>
              <td colspan="4" width="100%">&nbsp;</td>
            </tr>
            <tr>
              <td colspan="3" width="67%">Sub-total</td>
              <td width="54%">${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td  colspan="3" width="67%"><span>Tax at ${100*tax_rate}%</span></td>
              <td width="54%">${tax.toFixed(2)}</td>
            </tr>
            <tr>
                <td  colspan="3" width="67%">Shipping</span></td>
                <td width="54%">${shipping.toFixed(2)}</td>
              </tr>
            <tr>
              <td colspan="3" width="67%"><strong>Total</strong></td>
              <td width="54%"><strong>${total.toFixed(2)}</strong></td>
            </tr>
            <tr>
              <td style="text-align: center;" colspan="4"> <strong>OUR SHIPPING POLICY IS: A subtotal $0 - $49.99 will be $2 shipping
                A subtotal $50 - $99.99 will be $5 shipping
                Subtotals over $100 will be charged 5% of the subtotal amount</strong>
              </td>
          </tr>
      </tbody>
        </table> 
      </section>`;
    // this sends an invoice to the user's email        

    //this code was made with help from assignment 3 examples provided for us
    //hopefully this works
    var transporter = nodemailer.createTransport({ //create the transporter variable
        host: 'mail.hawaii.edu', //note on itmvm webserver have to use the mail from hawaii.edu
        port: 25,
        secure: false, //use tls
        tls: {
            //do not fail on invalid 
            rejectUnauthorized: false
        }
    });
    //from assignment 3
    var mailOptions = {
        from: 'rcbautista2000@gmail.com', //sends the invoice from one of my personal emails
        to: email, //sends the email to cookie from the account that was logged in
        subject: 'Aesthete Invoice',
        html: str //the string then returns as html 
    };
    //notification in console
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) { 
            console.log(error);
        } else { 
            console.log('Email sent: ' + info.response);
        }
    });

    response.send(str); // string goes to be displayed in browser
});

//adapted from lab15 
app.use(session({ //
    secret: 'ITM352 Rocks!', //encrypts the session 
    resave: true, //saves the session
    saveUninitialized: false, //deletes or forgets session when it is done
    httpOnly: false, //doesnt allow access of cookies 
    secure: true, //only uses cookies in HTTPS
    ephemeral: true //this deletes this cookie when browser is closed 
}));

//process the quantityForm when POST request is made
app.post("/process_form", function (request, response) { 
    let POST = request.body; // data is in the body 

    if (typeof POST['addProducts${i}'] != 'undefined') { //if the POST request is defined
        var validAmount = true; //make the variable validAmount true 
        var amount = false; //make the variable amount equal to false 

        for (i = 0; i < `${(products_array[`type`][i])}`.length; i++) { //for any product
            qty = POST[`quantity_textbox${i}`]; //sets the variable qty to quantity textbox 

            if (qty > 0) {
                amount = true; //if greater than 0 it is goog 
            }

            if (isNonNegInt(qty) == false) { //if isNonNegInt is false then it is not a number
                validAmount = false; // it is not a valid amount
            }

        }

        const stringified = queryString.stringify(POST); //converts data from POST to JSON string 

        if (validAmount && amount) { //if it is a quanity and greater than 0
            response.redirect("./login.html?" + stringified); // redirect the page to login page if You are currently not logged in. 
            return; //stops function
        }

        else { response.redirect("./index.html?" + stringified) } //if there is invalid sends back to home page with the string 

    }

});

//repeats the isNonNegInt function
function isNonNegInt(q, return_errors = false) {
    errors = []; // assume no errors at first
    if (q == '') q = 0; // handle blank inputs as if they are 0
    if (Number(q) != q) errors.push('<font color="red">Not a number</font>'); // Check if string is a number value
    if (q < 0) errors.push('<font color="red">Negative number</font>'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not a full product</font>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}

//adapted from Lab 14 Exercise 3
app.post("/check_login", function (request, response) {// Process login form from POST Request
    errs = {}; //assume no errors at first
    var usernameLogin = request.body["username"]; //set var usernameLogin to the username 
    var user_info = userdata[usernameLogin]; //sets a variable
    var passwordLogin = request.body["password"]; //sets a variable

    if (typeof userdata[usernameLogin] == 'undefined' || userdata[usernameLogin] == '') { // If the username is defined
        errs.username = '<font color="red">Incorrect Username</font>'; //If invalid usersername doesnt match 
        errs.password = '<font color="red">Incorrect Password</font>'; //If username does not match anything in json file, password cannot match username
    } else if (user_info['password'] != passwordLogin) {
        errs.username = ''; //remove error
        errs.password = '<font color="red">Incorrect Password</font>'; //wrong password still
    } else {
        delete errs.username; //remove error
        delete errs.password; //remove error
    };

    if (Object.keys(errs).length == 0) { //If no errors exist 
        //Used with help from Lab15 Exercise4 
        session.username = usernameLogin; //adds username to the session 
        var theDate = Date.now(); //adds the login time 
        session.last_login_time = theDate; //this login is saved in a session 
        var login_name = user_info['name']; //sets a variable 
        var user_email = user_info['email']; //sets a variable
        response.cookie('username', usernameLogin) //puts the username in a cookie
        response.cookie('name', login_name) //puts the name in a cookie 
        response.cookie('email', user_email); //puts the email in a cookie 
        response.json({}); //parses it into a json object 
    } else {
        response.json(errs); //if fails it shows errors 
    };

});

/*
the following two functions validate the information in the form 
// found this info through this website 
// https://docs.netapp.com/oci-73/index.jsp?topic=%2Fcom.netapp.doc.oci-acg%2FGUID-452051E1-0F8B-415E-87FE-D8AD97881072.html 
*/
function ValidateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //email can only contain letter, numbers, @ symbo 
    if (inputText.match(mailformat)) { //the input must match above requirements to be a valid email 
        return true; 
    }
    else {
        return false; //email is invalid 
    }
}


function isAlphaNumeric(input) {
    var letterNumber = /^[0-9a-zA-Z]+$/; //can only be variables or numbers 
    if (input.match(letterNumber)) { //the input must match above requirements 
        return true;
    }
    else { 
        return false; //it is invalid 
    }
}

//adapted from Lab 14 Exercise 4
app.post("/register_user", function (request, response) {
    // processing a registration form 
    errs = {}; //assume no errors at first
    // helps indicate if there is any errors in the username, password, email
    var registered_username = request.body["username"]; //set variable 
    var registered_name = request.body["name"]; //set variable 

    //username  section
    if (registered_username == '') { //username is required
        errs.username = '<font color="red">Please Enter A Username</font>';
    } else if (registered_username.length < 4 || registered_username.length > 10) { //the username has to be between 4 and 10 characters 
        errs.username = '<font color="red">Username Must Be Between 4 & 10 Characters</font>'; //error messgae if not 
    } else if (isAlphaNumeric(registered_username) == false) { //username can only be letters and numbers 
        errs.username = '<font color="red">Please Only Use Alphanumeric Characters</font>'; //error if not
    } else if (typeof userdata[registered_username] != "undefined") { //checks if username is taken
        errs.username = '<font color="red">Username Taken</font>'; //error if taken 
    } else {
        errs.username = null;
    }

    //name section
    if (registered_name.length > 30) { //name has to be shorter than 30 
        errs.name = '<font color="red">Cannot Be Longer Than 30 Characters</font>';
    } else {
        errs.name = null;
    }

    //password section
    if (request.body.password.length == 0) {  
        errs.password = '<font color="red">Please Enter A Password</font>';
    } else if (request.body.password.length <= 5) { //password is at least 6 characters 
        errs.password = '<font color="red">Password Must Be At Least 6 Characters</font>';
    } else if (request["body"]["password"] != request["body"]["repeat_password"]) {//checks if repeat field is same
        errs.password = null;
        errs.repeat_password = '<font color="red">Passwords Do Not Match</font>'; //error if passwords don't match
    } else {
        delete errs.password;
        errs.repeat_password = null;
    }

    //email section
    if (request.body.email == '') { 
        errs.email = '<font color="red">Please Enter An Email Address</font>';
    } else if (ValidateEmail(request.body.email) == false) { //if does not follow proper email format, give error
        errs.email = '<font color="red">Please Enter A Valid Email Address</font>';
    } else {
        errs.email = null;
    }

    let result = !Object.values(errs).every(o => o === null); 
    console.log(result); 

    if (result == false) { //when there are no errors 
        //sets the below to what the user entered 
        userdata[registered_username] = {}; 
        userdata[registered_username].name = request.body.name; 
        userdata[registered_username].password = request.body.password; 
        userdata[registered_username].email = request.body.email; 
        fs.writeFileSync(userInfoFile, JSON.stringify(userdata, null, 2));
        response.cookie("username", registered_username); 
        response.cookie("name", registered_name); 
        response.cookie("email", request.body.email); 
        response.json({}); 
    } else {
        response.json(errs); 
    }

});

// user's session resets when logging out
app.post('/logout', function (request, response) { 
    request.session.reset(); 
    response.redirect('/index.html'); 
});

app.use(express.static('./public')); //everythin is in the public directory 
app.listen(8080, () => console.log(`listening on port 8080`)); //runs on port 8080 

