var sequences = [];

function getSequences(n, k, sequence) {
	sequence = sequence || [];

	// calculate the highest possible value of a number, such that it leaves at least enough left over to fill the rest with 1s
	var upper = n - k + 1;

	for (var c = 1; c <= upper; c += 1) {
		var sub_sequence = sequence.slice(0);
		sub_sequence.push(c);

		// how many slots remain and how much remaining value do we have?
		var remaining_slots = k - 1;
		var remaining_value = n - c;

		if (remaining_slots == 1) {
			sub_sequence.push(remaining_value);
			sequences.push(sub_sequence.slice(0));
		} else {
			getSequences(n - c, k - 1, sub_sequence);
		}		
	}
}

if (require.main === module) {
	var argv = require('minimist')(process.argv.slice(2));

	if (!argv.N || !argv.K) {
		console.log("Please supply --K (total value) and --N (size of square)");
		return;
	}
	var N = parseInt(argv.N, 10); // the total value of the sequence
	var K = parseInt(argv.K, 10); // number of items in the sequence
	getSequences(N, K);
	console.log(sequences);
	console.log("(" + sequences.length + " total)");
}

module.exports = function(N, K) {
	getSequences(N, K);
	return sequences;
}