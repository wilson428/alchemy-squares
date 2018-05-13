// Get all the sequences for N and K and organize them as a tree for easy lookup

const fs = require('fs');
const alchemy = require('../../index')

var tree = {};
var sequences;

function buildTree(seqs, branch, depth) {	
	if (!seqs) {
		return;
	}
	seqs.forEach(seq => {
		var d = seq[depth];
		if (!branch.hasOwnProperty(d)) {
			branch[d] = (depth == sequences[0].length - 1) ? { sequences: [] } : { sequences: [], children: {} };
		}
		branch[d].sequences.push(seq);
	});

	if (depth < sequences[0].length - 1) {
		Object.keys(branch).forEach(key => {
			buildTree(branch[key].sequences, branch[key].children, depth + 1);
		});
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
	sequences = alchemy.sequences(N, K);
	buildTree(sequences, tree, 0);
	fs.writeFileSync(__dirname + "/logs/tree_" + N + "_" + K + ".json", JSON.stringify(tree, null, 2));
}

module.exports = function(N, K, write) {
	sequences = alchemy.sequences(N, K);
	buildTree(sequences, tree, 0);
	if (write) {
		fs.writeFileSync(__dirname + "/logs/tree_" + N + "_" + K + ".json", JSON.stringify(tree, null, 2));		
	}
	return tree;
}