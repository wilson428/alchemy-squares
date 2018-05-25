const fs = require('fs');
const alchemy = require('../../index')
const sequence_tree = require('./sequence_tree');
const utils = require('./utilities');

function randomTree(N, K) {
	var sequences = alchemy.sequences(N, K);
	var tree = sequence_tree(sequences);

	var square = utils.getEmptySquare(K);

	// we'll start with the first number in a randomly selected sequence:
	var start = utils.getRandom(tree.sequences);
	square[0] = start;
	square[2] = utils.getRandom(tree.sequences);



	var pressure = utils.setPressure(square, N, K);

	square = pressure.square;

	console.log(pressure);

	utils.print(square, 5, 1);




	return;


	for (var c = 0; c < 4; c += 1) {
		// get all eligible rows
		var candidates = tree;
		for (var i = 0; i < K; i += 1) {
			if (square[c][i] > 0) {
				candidates = candidates.children[square[c][i]];
				if (!candidates) {
					console.log("NO SEQUENCES LEFT!");
					break;
				} else {
					console.log("row candidates reduced to", candidates.sequences.length, "by value", square[c][i]);
				}
			}
		}

		if (!candidates) {
			console.log("Goodbye");
			break;
		}

		var row = getRandom(candidates.sequences);
		square[c] = row;
		var pressure = updatePressure(square, N, K);

		console.log(square);

		// now add a column
		var candidates = tree;
		for (var i = 0; i < K; i += 1) {
			if (square[i][c] > 0) {
				candidates = candidates.children[square[i][c]];
				if (!candidates) {
					console.log("NO SEQUENCES LEFT!");
					break;
				} else {
					console.log("column candidates reduced to", candidates.sequences.length, "by value", square[i][c]);
				}
			}
		}

		if (!candidates) {
			console.log("Goodbye");
			break;
		}		

		var column = getRandom(candidates.sequences);
		setColumn(square, column, c);
		var pressure = updatePressure(square, N, K);

		console.log(square);
	}



	// console.log(square);

	// console.log(pressure);

	// Object.keys(tree).forEach(key => {
	// 	console.log(key, tree[key].sequences.length);
	// });
}

if (require.main === module) {
	var argv = require('minimist')(process.argv.slice(2));

	if (!argv.N || !argv.K) {
		console.log("Please supply --K (total value) and --N (size of square)");
		return;
	}
	var N = parseInt(argv.N, 10); // the total value of the sequence
	var K = parseInt(argv.K, 10); // number of items in the sequence

	randomTree(N, K);

}



module.exports = function(N, K, write) {

}