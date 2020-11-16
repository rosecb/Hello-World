const fs = require('fs');

const user_data_filename = 'user_data.json';

var data = fs.readFileSync(user_data_filename, 'utf-8');
// this can describe what it is. it is helpful when you use it in multiple places.

user_reg_data = JSON.parse(data);

console.log(user_reg_data, typeof user_reg_data, typeof data);