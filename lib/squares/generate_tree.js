const fs = require('fs');
const alchemy = require('../../index')
const sequence_tree = require('./sequence_tree');

function randomTree(N, K) {
	// check if we already made the tree
	if (fs.existsSync(__dirname + "/logs/tree_" + N + "_" + K + ".json")) {
		var tree = require(__dirname + "/logs/tree_" + N + "_" + K + ".json");
	} else {
		var tree = sequence_tree(N, K, true);
	}
	Object.keys(tree).forEach(key => {
		console.log(key, tree[key].sequences.length);
	});
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