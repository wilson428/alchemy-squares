const fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

if (!argv.N || !argv.K) {
	console.log("Please supply --K (total value) and --N (size of square)");
	return;
}

var N = parseInt(argv.N, 10); // the total value of the sequence
var K = parseInt(argv.K, 10); // number of items in the sequence

function output(depth) {
	if (!argv.log) {
		return;
	}
	var message = Object.values(arguments).slice(1).join(" ");
	console.log("000".slice(0, -String(depth).length) + depth + "--".repeat(depth) + "|", message);
}


var sequences = [];
var lookup = {};
var repeats = 0;

function getSequences(n, k, sequence, depth) {
	sequence = sequence || [];
	depth = depth || 0;

	// calculate the highest possible value of a number, such that it leaves at least enough left over to fill the rest with 1s
	var upper = n - k + 1;
	var lower = Math.ceil(n / k);

	output(depth, sequence, "n:", n, "k:", k, "upper:", upper, "lower:", lower);

	for (var c = upper; c >= lower; c -= 1) {
		if (c > sequence[0]) {
			continue;
		}
		var sub_sequence = [c].concat(sequence);

		// how many spaces are to the left and how much remaining value do we have?
		var remaining_slots = k - 1;
		var remaining_value = n - c;

		// console.log("000".slice(0, -String(depth).length) + depth + "--".repeat(depth) + ": ", sub_sequence, remaining_slots, remaining_value);

		if (!remaining_slots) {
			// console.log("000".slice(0, -String(depth).length) + depth + "--".repeat(depth) + ": None left");
			output(depth, "None left")
			var key = sub_sequence.join("_");
			if (lookup[key]) {
				// console.log("000".slice(0, -String(depth).length) + depth + "--".repeat(depth) + ": " + sub_sequence, "(repeat)");
				output(depth, sub_sequence, "(repeat)");
				repeats += 1;
			} else {
				lookup[key] = sub_sequence.slice(0);
				// console.log("000".slice(0, -String(depth).length) + depth + "--".repeat(depth) + ": " + sub_sequence, "(pushed)");				
				output(depth, sub_sequence, "(pushed)");
				sequences.push(sub_sequence.slice(0));
			}
			continue;
		} else {
			getSequences(n - c, k - 1, sub_sequence, depth + 1);
		}		
	}


		/*
		// if there are only two slots left, we can easily calculate the possibilities
		if (remaining_slots === 2) {
			console.log("000".slice(0, -String(depth).length) + depth + "--".repeat(depth) + ": Two left");
			// the smaller of the closest pair of numbers adding to n
			// e.g., 3 for [ [1,6], [2,5], [3,4] ]
			var lower_bound = Math.floor(remaining_value / 2); 
			for (var i = 1; i <= lower_bound; i += 1) {
				var unique_sequence = [i, remaining_value - i].concat(sub_sequence);
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
		} */

}

getSequences(N, K);

console.log(sequences);
console.log("Found", Object.keys(lookup).length, "unique sequences with", repeats, "repeats.");
fs.writeFileSync("logs/algorithm_B_" + N + "_" + K + ".csv", "algorithm_A\n" + Object.keys(lookup).sort().join("\n"));