function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); 
    if(q < 0) errors.push('Negative value!'); 
    if(parseInt(q) != q) errors.push('Not an integer!'); 
    return returnErrors ? errors : ((errors.length > 0)?false:true);
}
