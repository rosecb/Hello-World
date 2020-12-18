//Creating a server via express//
var data = require('./public/product_data.js'); //get the data from product_data.js
var products = data.products;

// So it'll load querystring// 
const queryString = require('query-string'); // so it'll load querystring// 
var filename = 'user_data.json'; // new//
var fs = require('fs'); //Load file system//
var express = require('express'); //Server requires express to run//
var app = express(); //Run the express function and start express//
var myParser = require("body-parser");
var cookieParser = require('cookie-parser'); //using cookie session
app.use(cookieParser());
var session = require('express-session'); // using express session
const nodemailer = require("nodemailer"); //using the node mailer module (sudo npm install nodemailer)

app.use(session({
  secret: "ITM352 rocks!"}));  // way to keep it private 
if (fs.existsSync(filename)) {
    stats = fs.statSync(filename) //gets stats from file
    console.log(filename + 'has' + stats.size + 'characters');

    data = fs.readFileSync(filename, 'utf-8');
    users_reg_data = JSON.parse(data);
} else { 
    console.log(filename + 'does not exist!');
}

// Go to invoice if quantity values are good, if not redirect back to order page//
//new//
// means any path //
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path)
    next();
});
// Gennerates each page where there is a product
app.get("*/:ptype[.]html", function (request, response, next) {
  if (typeof products[request.params.ptype] == 'undefined')
  {
    next();
    return;
  }
  // 
  str = '{}'; 
  if( typeof request.session[request.params.ptype] != 'undefined') {
    str = JSON.stringify(request.session[request.params.ptype]);
  }
  //Used template to load pages from the server
   var pagestring = fs.readFileSync('./displayproducts.tl', 'utf-8'); 
   pagestring = `<script> var cart = ${str}; </script>` + pagestring; //so the cart shows in the console
   pagestring = `<script> var product_type = '${request.params.ptype}'; </script>` + pagestring;
   response.send(pagestring);
});

app.use(cookieParser());
app.get("/login", function (request, response) {
response.cookie('username', 'dport', {maxAge: 60 * 1000}).send('cookie sent!')
});
app.get("/logout", function (request, response) {
    username = request.cookies;
    response.clearCookie('username').send('logged out ${username}');
    });

app.use(myParser.urlencoded({ extended: true })); //get data in the body//
//to process the response from what is typed in the form//

// login stuff starts here , reference from lab15// 
app.post("/process_login", function (req, res) {
    var LogError = [];
    console.log(req.query);
    the_username = req.body.username.toLowerCase();
    if (typeof users_reg_data[the_username] != 'undefined') {
        //Asking object if it has matching username, if it doesnt itll be undefined.
        if (users_reg_data[the_username].password == req.body.password) {
            the_username = req.body.username;
            //If username given is not undefined (checks if it ecists)
            if (typeof users_reg_data[the_username] != 'undefined') {
              //then get the password from the json data, and check if it is the same as password entered
              if (users_reg_data[the_username].password == req.body.password) { 
                response.redirect('./index.html');
              } 
              else {
                response.redirect('./login.html');
              }
            }
            //Redirect to cart if they logged in correctly
            console.log(users_reg_data[req.query.username].name); 
            req.query.name = users_reg_data[req.query.username].name
            res.redirect('/invoice.html?' + queryString.stringify(req.query));
            return;
           
        } else {
            LogError.push = ('Invalid Password'); 
  
      console.log(LogError);
      req.query.username= the_username;
      req.query.name= users_reg_data[the_username].name;
      req.query.LogError=LogError.join(';');
        }
    } else {
        LogError.push = ('Invalid Username');
        console.log(LogError);
        req.query.username= the_username;
        req.query.LogError=LogError.join(';');
    }
    res.redirect('./login.html?' ); // if it doesn't work, redirect to login
});
//Allows us to load in the cart page , reference from professor
app.get("/cart.html", function (request, response) {
  cartfile = `<script> var cart = ${JSON.stringify(request.session)}</script>`;
  cartfile += fs.readFileSync('./public/cart.html', 'utf-8'); // add it onto the cart page which is in public
  response.send(cartfile);

});

//Registration starts here//
app.post("/process_register", function (req, res) {
    qstr = req.body
    console.log(qstr);
    var errors = [];

    if (/^[A-Za-z]+$/.test(req.body.name)) {
    }
    else {
      errors.push('Use Letters Only for Full Name') // validating the info put in from now on 
    }
    // validating name
    if (req.body.name == "") {
      errors.push('Invalid Full Name');
    }
    // length of full name is less than 30
    if ((req.body.fullname.length > 30)) {
      errors.push('Full Name Too Long')
    }
    // length of full name is between 0 and 25 
  if ((req.body.fullname.length > 25 && req.body.fullname.length <0)) {
    errors.push('Full Name Too Long')
  }

    var reguser = req.body.username.toLowerCase(); 
    if (typeof users_reg_data[reguser] != 'undefined') { 
      errors.push('Username taken')
    }

    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) {
    }
    else {
      errors.push('Letters And Numbers Only for Username')
    }
  
    //password is min 8 characters long 
    if ((req.body.password.length < 8 && req.body.username.length > 20)) {
      errors.push('Password Too Short')
    }
    // check to see if passwords match
    if (req.body.password !== req.body.repeat_password) { 
      errors.push('Password Not a Match')
    }

    if (errors.length == 0) { // checking if it is not 0 
       console.log('none');
       req.query.username = reguser;
       req.query.name = req.body.name;
       res.redirect('/index.html?')
       //+ queryString.stringify(req.query)) // after done, direct to cart//
    }
    if (errors.length > 0) {
        console.log(errors)
        req.query.name = req.body.name;
        req.query.username = req.body.username;
        req.query.password = req.body.password;
        req.query.repeat_password = req.body.repeat_password;
        req.query.email = req.body.email;

        req.query.errors = errors.join(';');
        res.redirect('register.html?');
    }
});


// You're still on the products page
app.post("/process_cart", function (request, response) {
    let POST = request.body; // data would be packaged in the body//
    let product_type = POST["product_type"];
  console.log(POST);
    if (typeof POST['submitcart'] != 'undefined') {
        var hasvalidquantities=true; // creating a varibale assuming that it'll be true// 
        var hasquantities=false // creating a variable hasquantities and assuming it will be false
        for (i = 0; i < products[product_type].length; i++) {
            
                        qty=POST[`quantity${i}`]; // set variable 'qty' to the value in quantity
                        hasquantities=hasquantities || qty>0; // If it has a value bigger than 0 then it is good//
                        hasvalidquantities=hasvalidquantities && isNonNegInt(qty);    // if it is both a quantity over 0 and is valid//     
        } 
        // if all quantities are valid, generate the invoice// 
        const stringified = queryString.stringify(POST); // converts the data in the POST to a JSON string and sets it to the variable 'stringified'
        if (hasvalidquantities && hasquantities) { // if it is both a quantity over 0 and is valid 
          // add the selectiond to the session// 
          request.session[product_type] = POST; 
          console.log(request.session);
            response.redirect("./cart.html?"+stringified); // should redirect you to the next page with the data inside it//
        }  
        else {response.send('Enter a valid quantity!')} // To let them know if wasn't a valid quantity
    
    }
}); 

// from assignment 3 examples
app.get("/checkout", function (request, response) {
  // Generate HTML invoice string
    var invoice_str = `Thank you for your order!<table border><th>Quantity</th><th>Item</th>`;
    var shopping_cart = request.session.cart;
    for(product_key in products_data) {
      for(i=0; i<products_data[product_key].length; i++) {
          if(typeof shopping_cart[product_key] == 'undefined') continue;
          qty = shopping_cart[product_key][i];
          if(qty > 0) {
            invoice_str += `<tr><td>${qty}</td><td>${products_data[product_key][i].name}</td><tr>`;
          }
      }
  }
    invoice_str += '</table>';
  // Set up mail server. Only will work on UH Network due to security restrictions
    var transporter = nodemailer.createTransport({
      host: "mail.hawaii.edu",
      port: 25,
      secure: false, // use TLS
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    });
  
    var mailOptions = {
      from: 'rcbautista2000@gmail.com',
      to: user_email,
      subject: 'Aesthete Invoice',
      html: invoice_str
    };
  
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        invoice_str += '<br>There was an error and your invoice could not be emailed :(';
      } else {
        invoice_str += `<br>Your invoice was mailed to ${user_email}`;
      }
      response.send(invoice_str);
    });
   
  });


function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume that quantity data is valid 
    if (q == "") { q = 0; } //handle black inputs as if they are 0 
    if (Number(q) != q) errors.push('Not a number!'); //check if value is a number
    if (q < 0) errors.push('Negative value!'); //check if value is a positive number
    if (parseInt(q) != q) errors.push('Not an integer!'); //check if value is a whole number
    return returnErrors ? errors : (errors.length == 0);
}
app.use(express.static('./public')); //Creates a static server using express from the public folder
app.listen(8080, () => console.log(`listen on port 8080`))