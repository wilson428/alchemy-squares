var getRandom = function(arr) {
	return arr[Math.floor(Math.random() * arr.length)]
};

var getRandomN = function(n) {
	return Math.floor(Math.random() * (n - 1)) + 1;
};

// https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
function subset(candidates, seq) {
	for (var c = 0; c < seq.length; c += 1) {
		var val = seq[c];
		if (val) {
			candidates = candidates.filter(d => { return d[c] == val; });
		}
	}
	return candidates;
}

module.exports = function(Square) {

	// randomly chose a K-set for this sequence from available options
	// then reduce the remaining sequences to their possible candidates
	Square.prototype.populateSequence = function(seq_id) {
		var seq = this.sequences[seq_id];
		var values = getRandom(seq.candidates);
		seq.candidates = -1;
		this.setSequence(seq_id, values);

		// now let's reduce the candidates
		Object.keys(this.sequences).forEach(seq_id => {
			var seq = this.sequences[seq_id];

			// console.log(seq);
			if (seq.candidates === -1) {
				return;
			}

			var current = this.getSequence(seq_id);
			var l1 = seq.candidates.length;
			seq.candidates = subset(seq.candidates, current);
			var l2 = seq.candidates.length;
			console.log(current);
			console.log("Reduced", seq_id, "from", l1, "candidates to", l2, "candidates based on", current.join(" "));

		});
	};
}