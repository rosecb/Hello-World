var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs'); 
var data = require('./public/product_data.js');
var products = data.products;

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) {
   let POST = request.body;
   process_quantity_form(POST, response);
});

app.get('/hello.txt', function (request, response, next) {
    response.send("Got a POST to /test path");
    next();
});

app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here

function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); 
    else {
        if(q < 0) errors.push('Negative value!'); 
        if(parseInt(q) != q) errors.push('Not an integer!'); 
    }
    return returnErrors ? errors : ((errors.length > 0)?false:true);
}

function checkQuantityTextbox(theTextbox) {
    errs = isNonNegInt(theTextbox.value, true);
    document.getElementById(theTextbox.name + '_message').innerHTML = errs.join(", ");
}


function process_quantity_form (POST, response) {
    if (typeof POST['purchase_submit_button'] != 'undefined') {
       var contents = fs.readFileSync('./views/display_quantity_template.view', 'utf8');
       receipt = '';
       for(i in products) { 
        let q = POST[`quantity_textbox${i}`];
        let model = products[i]['model'];
        let model_price = products[i]['price'];
        if (isNonNegInt(q)) {
          receipt += eval('`' + contents + '`'); // render template string
        } else {
          receipt += `<h3><font color="red">${q} is not a valid quantity for ${model}!</font></h3>`;
        }
      }
      response.send(receipt);
      response.end();
    }
 }
 