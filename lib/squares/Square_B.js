// var square;
// var N;
// var K;

const Sequences = require('./Sequences');

var Square = function(n, k, log) {
	this.log = log || false;
	this.N = n;
	this.K = k;
	this.tiles = [];
	this.sequences = {};
	this.Sequence = new Sequences(n, k);
	this.candidates = this.Sequence.sequences;

	// first we build the tiles
	for (var c = 0; c < this.K; c += 1) {
		var number = String(c);
		this.tiles.push([]);
		for (var i = 0; i < this.K; i += 1) {
			var letter = String.fromCharCode(97 + i);			
			this.tiles[c].push({ value: null, id: number + letter });
		}
	}

	// now we tie those tiles to the K*K + 2 sequences, set that updating a sequence updates the tiles and vice versa

	this.sequences["diagonal_NW_SE"] = {
		name: "diagonal_NW_SE",
		values: [],
		candidates: this.candidates.slice(0)
	};

	this.sequences["diagonal_NE_SW"] = {
		name: "diagonal_NE_SW",
		values: [],
		candidates: this.candidates.slice(0)
	};

	for (var c = 0; c < this.K; c += 1) {
		var number = String(c);

		this.sequences["row_" + number] = {
			name: "row_" + number,
			values: this.tiles[c],
			candidates: this.candidates.slice(0)
		};

		for (var i = 0; i < this.K; i += 1) {
			var letter = String.fromCharCode(97 + c);

			if (i === 0) {
				this.sequences["column_" + letter] = {
					name: "column_" + letter,
					values: [],
					candidates: this.candidates.slice(0)
				};
			}

			this.sequences["column_" + letter].values.push(this.tiles[i][c]);

			if (c === i) {
				this.sequences["diagonal_NW_SE"].values.push(this.tiles[c][i]);
			} else if (c + i == this.K - 1) {
				this.sequences["diagonal_NE_SW"].values.push(this.tiles[i][c]);
			}
		}
	}

	// just for sanity's sake, let's reverse NE_SW so that both diagonals point downward
	this.sequences["diagonal_NE_SW"].values.reverse();
}

module.exports = Square;

// return the values of this sequence
Square.prototype.getSequence = function(s_id) {
	return this.sequences[s_id].values.map(d => { return d.value; });
};

Square.prototype.setSequence = function(s_id, seq) {
	seq.forEach((s,i) => {
		this.sequences[s_id].values[i].value = s;
	});
	this.sequences[s_id].candidates = -1;
};

// check for whether an alchemy square is still valid
Square.prototype.audit = function() {
	var valid = true;

	this.sequences.forEach(s => {
		var total = 0;
		s.seq.forEach(d => {
			total += d || 0;			
		});
		if (total > this.N) {
			valid = false;
			console.log("ERROR:", s.id, "totals to", total, "which is greater than", this.N);
		}		
	});
	return valid;
}

// w is width of row in ASCII
// padding is number of empty rows to put above and below
// w is width of row in ASCII
// padding is number of empty rows to put above and below
Square.prototype.print = function(w, padding, as_string) {
	if (typeof w == "undefined") { w = 9; }
	if (typeof padding == "undefined") { padding = 1; }

	var output = [];

	var length = this.K * w + this.K + 1;
	var line = new Array(length).fill("-").join('');
	var blank_row = new Array(this.K).fill("|" + new Array(w).fill(" ").join('')).join('') + "|";

	// console.log(line);
	output.push(line);
	// rows
	for (var c = 0; c < this.K; c += 1) {
		for (var i = 0; i < padding || 0; i += 1) {
			output.push(blank_row);
		}

		var seq = this.sequences["row_" + c];
		var row = this.getSequence("row_" + c);
		var prettyRow = [];
		console.log(seq.candidates.length);

		for (var i = 0; i < this.K; i += 1) {
			var s = row[i] ? String(row[i]) : ( "(" + seq.candidates.length + ")" );
			var width = w - s.length;
			while (width > 0) {
				// start on the right so that, if one side has one fewer space, it's the left
				s = s + " ";
				width -= 1;
				if (width == 0) {
					break;
				}
				s = " " + s;
				width -= 1;
			}
			prettyRow.push(s);
		}
		var prettyRow = '|' + prettyRow.join('|') + '|';
		output.push(prettyRow);

		// bottom padding
		for (var i = 0; i < padding || 0; i += 1) {
			output.push(blank_row);
		}
		output.push(line);
	}
	output = output.join("\n");
	console.log(output);
	return output;
};

Square.prototype.serialize = function() {
	var serial = "";
	for (var c = 0; c < this.K; c += 1) {
		for (var i = 0; i < this.K; i += 1) {
			if (this.tiles[c][i] !== null) {
				serial += String(this.tiles[c][i]);
			}
		}
	}
	return serial;
}

require("./pressure_B")(Square);

var getRandom = function(arr) {
	return arr[Math.floor(Math.random() * arr.length)]
};

var getRandomN = function(n) {
	return Math.floor(Math.random() * (n - 1)) + 1;
};