function isNonNegIntString(string_to_check, returnErrors = false) {
    /* 
    this function returns true if string_to_check is a non negative integer. 
    If returnErrors=true it will return the array of reasons it is not a non-negative integer.
    */
    errors = []; // assume no errors at first
    if(Number(string_to_check) != string_to_check) errors.push('Not a number!'); // Check if string is a number value
    if(string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer

    return returnErrors ? errors : (errors.length == 0);
}

name = "Rose";
age = 20;
attributes = name + ";" + age + ";" + (age + 0.5) + ";" + (0.5 - age);
pieces = attributes.split(';');

function callback(part,i) {
    console.log (`${part} is non neg int ${isNonNegIntString(part,true).join("***")}`);
}

pieces.forEach(function (item,i){console.log( (typeof item == 'string' && item.length > 0)?true:false )});
