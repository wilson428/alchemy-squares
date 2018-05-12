const fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

if (!argv.N || !argv.K) {
	console.log("Please supply --K (total value) and --N (size of square)");
	return;
}

var N = parseInt(argv.N, 10); // the total value of the sequence
var K = parseInt(argv.K, 10); // number of items in the sequence

var sequences = [];
var lookup = {};
var repeats = 0;

function getSequences(n, k, sequence, depth) {
	console.log("depth", depth);
	sequence = sequence || [];
	depth = depth || 0;

	// calculate the highest and lowest possible values of the right-most number
	var upper = n - k + 1;
	var lower = Math.ceil(n / k);

	console.log("000".slice(0, -String(depth).length) + depth + "--".repeat(depth) + ": ", n, k, sequence, upper, lower);

	for (let c = upper; c >= lower; c -= 1) {
		let sub_sequence = [c].concat(sequence);

		// how many spaces are to the left and how much remaining value do we have?
		let remaining_slots = k - 1;
		let remaining_value = n - c;

		console.log("000".slice(0, -String(depth).length) + depth + "--".repeat(depth) + ": ", sub_sequence, remaining_slots, remaining_value);

		// if there are only two slots left, we can easily calculate the possibilities
		if (remaining_slots === 2) {
			console.log("000".slice(0, -String(depth).length) + depth + "--".repeat(depth) + ": Two left");
			// the smaller of the closest pair of numbers adding to n
			// e.g., 3 for [ [1,6], [2,5], [3,4] ]
			let lower_bound = Math.floor(remaining_value / 2); 
			for (let i = 1; i <= lower_bound; i += 1) {
				let unique_sequence = [i, remaining_value - i].concat(sub_sequence);
				var key = unique_sequence.join("_");
				if (lookup[key]) {
					console.log("000".slice(0, -String(depth).length) + depth + "--".repeat(depth) + ": " + unique_sequence, "(repeat)");
					repeats += 1;
				} else {
					lookup[key] = unique_sequence.slice(0);
					console.log("000".slice(0, -String(depth).length) + depth + "--".repeat(depth) + ": " + unique_sequence);				
					sequences.push(unique_sequence.slice(0));
				}
			}
		} else {
			getSequences(n - c, k - 1, sub_sequence, depth + 1);
		}
	}
}

getSequences(N, K);

console.log(sequences);
console.log("Found", Object.keys(lookup).length, "unique sequences with", repeats, "repeats.");
fs.writeFileSync("logs/algorithm_B_" + N + "_" + K + ".csv", "algorithm_A\n" + Object.keys(lookup).sort().join("\n"))