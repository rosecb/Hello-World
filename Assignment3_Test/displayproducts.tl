<script src="./product_data.js" type="text/javascript"></script>

<script>
    //Referenced from assignment 1 examples
    function isNonNegInt(q, return_errors = false) {
        errors = []; // assume no errors at first
        if (q == '') q = 0; // handle blank inputs as if they are 0
        if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if string is a number value
        else if (q < 0) errors.push('<font color="red">Negative value!</font>'); // Check if it is non-negative
        else if (parseInt(q) != q) errors.push('<font color="red">Not an integer!</font>'); // Check that it is an integer
        return return_errors ? errors : (errors.length == 0);
    }
    function checkQuantityTextbox(theTextbox) {
        errs = isNonNegInt(theTextbox.value, true);
        if (errs.length == 0) errs = ['You want:'];
        if (theTextbox.value.trim() == '') errs = ['Quantity'];
        document.getElementById(theTextbox.name + '_label').innerHTML = errs.join(", ");
   }
   //Add to session, from the amount in the cart
   function add_to_cart (i) {
    var incart = product_main_display[`quantity${i}`].value; 
    if (isNonNegInt(incart) = true) { 
        sessionStorage['products${i}'] = incart;
        console.log(incart) 
    } 
    


   }

    window.onload = function () {
        let params = (new URL(document.location)).searchParams; // get the query string which has the form data
        // form was submitted so check that quantities are valid then redirect to invoice if ok.
        if (params.has('submitPurchase')) {
            has_errors = false; // assume quantities are valid from the start
            total_qty = 0; // need to check if something was selected so we will look if the total > 0
            //For every product in the array, write the product number, display its image and name, and list price
            for (i = 0; i < products.length; i++) {
                if (params.has(`quantity${i}`)) {
                    a_qty = params.get(`quantity${i}`);
                    // make textboxes sticky in case of invalid data
                    product_form[`quantity${i}`].value = a_qty;
                    total_qty += a_qty;
                    if (!isNonNegInt(a_qty)) {
                        has_errors = true; // oops, invalid quantity
                        checkQuantityTextbox(product_form[`quantity${i}`]); // show where the error is
                    }
                }
            }
            // Now respond to errors or redirect to invoice if all is ok
            if (has_errors) {
                alert("Please enter only valid quantities!");
            } else if (total_qty == 0) { // no quantity selections, just give a general alert
                alert("Please select some quantities!");
            } else { // all good to go!
                window.location = `./login.html.html${document.location.search}`; //Redirects itself
                window.stop;
            }
        }
    }
</script>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Aesthete.</title>
    <link href="products-style.css" rel="stylesheet">

</head>
    

<style>
    /* general */
    body {
        font-family: "Inconsolata", monospace;
        margin: 0;
        background-color: white;
        color: black;
        text-align: center;
        font-size: 15px;
    }

    /* top portion showing what the customers see first */
    .home{
        color: #ecb7bf;
        font-size: 60px;
        text-shadow: 2px 2px 4px whitesmoke;
    }

    img{
        height: 200px;
        width: 200px;
        opacity: 100;
        border-radius: 50%;
    }

    img.resize {
        width: 200px;
        height: 200px;
    }

    .h3 {
        border-bottom: 1px solid black;
        padding-bottom: 5px;
    }

    main {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }

    /* products section */
    /* the design showing the products data is similar to that of the classic backpack with the general outline of the iconic looking bag */
    .bag {
        font-family: "Playfair Display", Georgia, Serif;
    }

    /* allows the image to be rounded which is similar to the classic backpack design */
    section.item {
        width: 300px;
        margin: 5px 5px 5px 5px;
        border: 1px;
        border-radius: 27px;
        background-color: #ECCBD9;
        padding: 4px;
    }

    /* allows the image to expand when hovering over it */
    section.img:hover {
        position: relative;
        height: auto;
        transform: scale(1.5);
    }

    /* allows the code for item, price description, and quantity to appear like a little pouch similar to the classic backpack */
    section.pouch {
        border: 1 px;
        background-color:#ecb7bf;
        margin: 5px 5px 5px 5px;
        padding: 4px;
        border-radius: 20px;
    }

    /* the thank you bottom portion*/
    .thank-you {
        margin-top: 50px;
        padding-top: 50px;
        background-color: #ecb7bf;
        padding-bottom: 50px;
    }

    .ty {
        padding-top: 20px;
    }

    /* buttons */
    input[type=submit] {
        padding: 5px; 
        border: none; 
        background: none;
        color: #ecb7bf;
        background-color: whitesmoke;
        width: 200px;
        align-self: center;
        font-size: 1.5em;
    }

    /* nav bar */
    .topnav {
        overflow: hidden;
        background-color:#ecb7bf;
    }
    
    .topnav a {
        float: left;
        color: grey;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
        font-size: 17px;
    }

    /* Changes color on hover*/
    .topnav a:hover {
        background-color: whitesmoke;
        color: #ecb7bf;
    }
</style>

<body>
    <div class="topnav"> 
        <a class="active" href="./index.html">Home</a>
        <a href="./login.html">Log In</a>
        <script>
        for (ptype in products) {
            if (ptype == product_type) {
                continue;
            }
            document.write(`<a href="./${ptype}.html">${ptype.charAt(0).toUpperCase() + ptype.slice(1)}</a>`);
        }
        </script>
        
    
      </div>


    <form name="product_main_display" action="process_cart" method="POST">

        <div style="background-image: url('./images/germany.jpg');
        background-size: cover; height:350px; padding-top:100px;">
        <header><div class="home">AESTHETE PRODUCTS.</div>
        </header>
        </div>
        <br>

        <main>
                <script>
                    document.write(`<input type="hidden"  name="product_type" value = "${product_type}">`);
                    for (i = 0; i < products[product_type].length; i++) {
                        document.write(`
                        <div class="bag">
                                <section class="item">
                                    <br>
                                    <section class="img">
                                    <img src="${products[product_type][i].image}">
                                </section>
                                <section class="pouch">
                                    <h2>${products[product_type][i].product}</h2>
                                    <h4>$${products[product_type][i].price}</h4>
                                    <p>${(products[product_type][i].description)}</p></td> 
                                    <label id="quantity${i}_label"}">Quantity</label>
                                    <input type="text" placeholder="0" name="quantity${i}" 
                                    onkeyup="checkQuantityTextbox(this);">
                                </section>
                            </div>
                            `);
                            if (typeof cart[`quantity${i}`] != 'undefined' ) {
                                product_main_display[`quantity${i}`].value = cart[`quantity${i}`];
                            }
                    }    
                </script>
            </main>
        </div>
        <footer>
            <br>
            <input type="submit" value="Add to cart" name="submitcart" onclick="add_to_cart">
        </footer>
    </form>

        <section class="thank-you">
            <div class="ty">
                <h3>T H A N K  Y O U</h3>
                <p>fall 2020 itm 352</p>
                <p>Disclaimer: this is for assignment purposes only! please note no transactions will go through.</p>
            </div>
        </section>
        
</body>

</html>            