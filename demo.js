var alchemy = require('./index');

console.log("Here's every combination of every sequence of 3 numbers that add to 8 in any order");

console.log(alchemy.sequences(8, 3));