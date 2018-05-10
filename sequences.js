var argv = require('minimist')(process.argv.slice(2));

if (!argv.K || !argv.N) {
	console.log("Please supply --K and --N");
	return;
}

var K = argv.K; // the total value of the sequence
var N = argv.N; // number of items in the sequence

var sequences = [];

function getNextSequence(sequence, depth) {
	if (!sequence) {
		depth = 0;
		sequence = [];
		for (var c = 0; c < N; c += 1) {
			sequence.push(c === N - 1 ? (K - N + 1) : 1);
		}
		sequences.push(sequence);
	}
	console.log(sequence, depth);
	for (var c = 0; c < N - 1; c += 1) {
		// look to see if this element can steal from it's neighbor to the right without exceeding it's value
		if (sequence[c + 1] - sequence[c] > 1) {
			var next_sequence = sequence.slice(0);
			next_sequence[c] += 1;
			next_sequence[c + 1] -= 1;
			sequences.push(next_sequence);
			getNextSequence(next_sequence, depth + 1);
		}
	}
} 

getNextSequence();