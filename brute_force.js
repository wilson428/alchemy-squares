const fs = require('fs');
const Combinatorics = require('js-combinatorics');
var argv = require('minimist')(process.argv.slice(2));

if (!argv.N || !argv.K) {
    console.log("Please supply --N and --K");
    return;
}

var N = argv.N; // the total value of the sequence
var K = argv.K; // number of items in the sequence

var set = Array.apply(null, Array(N - K + 1)).map(function (_, i) { return i + 1; });
var combos = Combinatorics.baseN(set, K).toArray();

var lookup = {};
var sets = [];

combos.forEach(combo => {
	// combo.sort((a,b) => { return a - b; });
	var sum = combo.reduce((total, num) => {
		return total + num;
	});	
	if (sum === N) {
		sets.push(combo);
		var key = combo.join("_");
		if (!lookup[key]) {
			lookup[key] = combo;
		}
	}
});

console.log("Total combinations: ", combos.length);
console.log("Unique combinations that add up to", N + ":");
console.log(Object.values(lookup));
console.log("(" + Object.values(lookup).length, "total)");
console.log(sets.length);

fs.writeFileSync("logs/brute_force_" + N + "_" + K + ".csv", "brute_force\n" + Object.keys(lookup).sort().join("\n"))