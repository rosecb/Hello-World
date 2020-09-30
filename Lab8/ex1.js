age_count = 1; // start the age counter
age = 19;
while(age_count < age) {
    if(age_count >= age/2) {
        console.log("I'm old!");
        break;
    }
    console.log(`age ${age_count}`);
    age_count++;
}
console.log(`Rose is ${age_count} years old`);

