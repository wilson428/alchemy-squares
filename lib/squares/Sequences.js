const sequences = require("../sequences/sequences")

var Sequences = function(n, k) {
	this.N = n;
	this.K = k;
	this.sequences = sequences(n, k);
}

// function all sequences that match a given partial sequence will null values for those missing
// e.g. [16, null, 7, null]
Sequences.prototype.getSubset = function(seq) {
	var subset = this.sequences.slice(0);
	for (var c = 0; c < seq.length; c += 1) {
		var val = seq[c];
		if (val) {
			subset = subset.filter(d => { return d[c] == val; });
		}
	}
	return subset;
}


Sequences.prototype.growTree = function() {
	this.tree = {
		// size: this.sequences.length,
		// sequences: this.sequences,
		children: {}
	};

	buildTree(this.K, this.sequences, this.tree, 0);
}

function buildTree(k, seqs, branch, depth) {	
	if (!seqs) {
		return;
	}
	seqs.forEach(seq => {
		var d = seq[depth];
		if (!branch.children.hasOwnProperty(d)) {
			branch.children[d] = (depth == k - 1) ? { size: 0, sequences: [] } : { size: 0, sequences: [], children: {} };
		}
		branch.children[d].sequences.push(seq);
		branch.children[d].size += 1;
	});

	if (depth < k - 1) {
		Object.keys(branch.children).forEach(key => {
			buildTree(k, branch.children[key].sequences, branch.children[key], depth + 1);
		});
	}
}

module.exports = Sequences;