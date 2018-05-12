const fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

if (!argv.N || !argv.K) {
	console.log("Please supply --K (total value) and --N (size of square)");
	return;
}

var N = parseInt(argv.N, 10); // the total value of the sequence
var K = parseInt(argv.K, 10); // number of items in the sequence

// if you pass --log, it will write to the console with indentation according to depth of recursion
function output(depth) {
	if (!argv.log) {
		return;
	}
	var message = Object.values(arguments).slice(1);
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

	output(depth, sequence, "n:", n, "k:", k, "upper:", upper);

	for (var c = 1; c <= upper; c += 1) {
		var sub_sequence = sequence.slice(0);
		sub_sequence.push(c);

		// how many slots remain and how much remaining value do we have?
		var remaining_slots = k - 1;
		var remaining_value = n - c;

		output(depth, sub_sequence, "remaining slots", remaining_slots, "remaining value", remaining_value);

		if (remaining_slots == 1) {
			output(depth, "One left")
			sub_sequence.push(remaining_value);
			var key = sub_sequence.join("_");
			if (lookup[key]) {
				output(depth, sub_sequence, "(repeat)");
				repeats += 1;
			} else {
				lookup[key] = sub_sequence.slice(0);
				output(depth, sub_sequence, "(pushed)");
				sequences.push(sub_sequence.slice(0));
			}
			continue;
		} else {
			getSequences(n - c, k - 1, sub_sequence, depth + 1);
		}		
	}
}

getSequences(N, K);

console.log(sequences);
console.log("Found", Object.keys(lookup).length, "unique sequences with", repeats, "repeats.");
fs.writeFileSync("logs/algorithm_C_" + N + "_" + K + ".csv", "algorithm_A\n" + Object.keys(lookup).sort().join("\n"))