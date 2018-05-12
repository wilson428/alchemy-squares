const fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

if (!argv.N || !argv.K) {
	console.log("Please supply --N (total value) and --K (size of square)");
	return;
}

var N = argv.N; // the total value of the sequence
var K = argv.K; // number of items in the sequence

var sequences = [];
var lookup = {};
var repeats = 0;

function getNextSequence(sequence, depth) {
	if (!sequence) {
		depth = 0;
		sequence = [];
		for (var c = 0; c < K; c += 1) {
			sequence.push(c === K - 1 ? (N - K + 1) : 1);
		}

		console.log("--".repeat(depth) + sequence);				
		sequences.push(sequence);
		var key = sequence.join("_");
		lookup[key] = sequence;

		depth += 1;
	}

	var c = K - 2;

	for (c; c >= 0; c -= 1) {
		if (sequence[c + 1] - sequence[c] > 1) { // look to see if this element can steal from it's neighbor to the right without exceeding it's value
			var next_sequence = sequence.slice(0);
			next_sequence[c] += 1;
			next_sequence[c + 1] -= 1;

			var key = next_sequence.join("_");

			if (lookup[key]) {
				console.log("000".slice(0, -String(depth).length) + depth + ":" + "--".repeat(depth) + ": " + next_sequence, "(repeat)");
				repeats += 1;
			} else {
				lookup[key] = next_sequence;
				console.log("000".slice(0, -String(depth).length) + depth + ":" + "--".repeat(depth) + ": " + next_sequence);				
				sequences.push(next_sequence.slice(0));
			}
			getNextSequence(next_sequence, depth + 1);
		} else if (sequence[c + 1] - sequence[c] > 0) { // otherwise steal anyway without saving the sequence in case we need it later
			sequence[c] += 1;
			sequence[c + 1] -= 1;
			// c = K - 1;
		}
	}
}

getNextSequence();

console.log(sequences);
console.log("Found", Object.keys(lookup).length, "unique sequences with", repeats, "repeats.");
fs.writeFileSync("logs/algorithm_A_" + N + "_" + K + ".csv", "algorithm_A\n" + Object.keys(lookup).sort().join("\n"))
