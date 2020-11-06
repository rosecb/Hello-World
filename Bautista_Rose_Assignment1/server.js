/*
Author: Rose Bautista
Date due: 11/05/2020
File Description: Javascript Server
*/
//server 

var express = require('express'); // express package
var app = express(); // starts express
var myParser = require("body-parser");
var products = require("./public/product_data.js");
var querystring = require("querystring");

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
   //ok all good generated an invoice
   qString = querystring.stringify(POST); //Stringing the query together
   if (hasValidQuantities == true && hasPurchases == true) { 
       response.redirect("./invoice.html?" + qString); // goes to invoice is correct
   }
   else { 
       response.redirect("./errors.html?" + qString); // goes to an error page to inform the person that they have inputted an invalid quantity.
   }
});

app.use(express.static('./public')); //set up a static route
app.listen(8080, () => console.log(`listening on port 8080`));

// function that returns errors
function isNonNegInt(q, returnErrors = false) {
   errors = []; // assume no errors at first
   if (q == "") { q = 0; }
   if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
   if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
   if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
   return returnErrors ? errors : (errors.length == 0);
}