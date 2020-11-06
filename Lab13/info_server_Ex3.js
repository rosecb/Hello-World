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

function process_quantity_form(POST, response) {
    let model = products[0]['model'];
    let model_price = products[0]['price'];
    if (typeof POST['quantity_textbox'] != 'undefined') {
        let q = POST['quantity_textbox'];
        if (isNonNegInt(q)) {
            var contents = fs.readFileSync('./views/display_quantity_template.view', 'utf8');
            response.send(eval('`' + contents + '`')); // render template string
        } else {
            response.send(`${q} is not a quantity!`);
        }
    }
}