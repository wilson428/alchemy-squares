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
	this.candidates = new Sequences(n, k).sequences;

	this.sequences["diagonal_NW_SE"] = {
		name: "diagonal_NW_SE",
		value: [], 
		tiles: [],
		candidates: this.candidates.slice(0)
	};

	this.sequences["diagonal_NE_SW"] = {
		name: "diagonal_NE_SW",
		value: [], 
		tiles: [],
		candidates: this.candidates.slice(0)
	};

	for (var c = 0; c < this.K; c += 1) {
		var number = String(c + 1);

		this.sequences["row_" + number] = {
			name: "row_" + number,
			value: [], 
			tiles: [],
			candidates: this.candidates.slice(0)
		};

		this.tiles.push([]);

		for (var i = 0; i < this.K; i += 1) {
			var letter = String.fromCharCode(97 + c);

			if (i === 0) {
				this.sequences["column_" + letter] = {
					name: "column_" + letter,
					value: [], 
					tiles: [],
					candidates: this.candidates.slice(0)
				};
			}

			this.tiles[c].push(null);
			
			var coordinates = [c, i];
			this.sequences["row_" + number].tiles.push(coordinates);
			this.sequences["column_" + letter].tiles.push(coordinates);

			// var tile = {
			// 	row: row,
			// 	column: column,
			// 	diagonal: null
			// };
			if (c === i) {
				this.sequences["diagonal_NW_SE"].tiles.push(coordinates);
			} else if (c + i == this.K - 1) {
				this.sequences["diagonal_NE_SW"].tiles.push(coordinates);
			}
		}
	}
}

module.exports = Square;

Square.prototype.getSequence = function(s_id) {
	var seq = [];
	this.sequences[s_id].tiles.forEach(d => {
		console.log(d);
		seq.push(this.tiles[d[0]][d[1]]);
	});
	return seq;
};

Square.prototype.setSequence = function(s_id, seq) {
	this.sequences[s_id].value.push(seq);
	for (var i = 0; i < seq.length; i += 1) {
		this.sequences[s_id].candidates = null;
		this.sequences[s_id].tiles.forEach((d, i) => {
			this.sequences[s_id].tiles[d[0]][d[1]] = seq[i];
		});
	}
};

Square.prototype.getColumn = function(c) {
	var seq = [];
	for (var i = 0; i < this.tiles[c].length; i += 1) {
		seq.push(this.tiles[i][c]);
	}
	return seq;
};

Square.prototype.setColumn = function(seq, i) {
	for (var c = 0; c < seq.length; c += 1) {
		this.tiles[c][i] = seq[c];
	}
};

Square.prototype.getDiagonal = function(direction) {
	var seq = [];

	for (var c = 0; c < this.tiles[0].length; c += 1) {
		if (direction == "NW_SE") {
			seq.push(this.tiles[c][c]);
		} else {
			seq.push(this.tiles[c][this.tiles[0].length - c - 1]);			
		}
	}
	return seq;
};


Square.prototype.setDiagonal = function(seq, direction) {
	for (var c = 0; c < seq.length; c += 1) {
		if (direction == "NW_SE") {
			this.tiles[c][c] = seq[c];
		} else {
			this.tiles[c][seq.length - c - 1] = seq[c];
		}
	}
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
	if (typeof w == "undefined") { w = 5; }
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

		var row = this.getRow(c);
		var prettyRow = [];
		for (var i = 0; i < row.length; i += 1) {
			var s = String(row[i] ? row[i] : '?');
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
				serial += String(this.tiles[c][i].value);
			}
		}
	}
	return serial;
}

require("./pressure_B")(Square);