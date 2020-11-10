const fs = require('fs');

var user_data_filename = 'user_data.json';
// this can describe what it is. it is helpful when you use it in multiple places.

var data = fs.readFileSync(user_data_filename, 'utc-8');
// when it is excuted, it will return with the contents of the file
// read the file synchronously then wait until the file comes back

users_reg_data = JSON.parse(data);
// convert the data into an object

// console.log(users_reg_data, typeof users_reg_data);
console.log(users_reg_data['dport']['password']);
// this allows you to get the specific object, for this one it is the dport password.