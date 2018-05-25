const alchemy = require('../../index')
const sequence_tree = require('./sequence_tree');
const utils = require('./utilities');

var N = 33;
var K = 4;

var square = utils.getEmptySquare(K);

for (var c = 0; c < K; c += 1) {
	for (var i = 0; i < K; i += 1) {
		square[c][i] = Math.round(Math.random() * N) * (Math.random() < 0.5 ? 1 : -1);
	}
}

utils.print(square, 7, 1);