// var square;
// var N;
// var K;

var Square = function(n, k, log) {
	this.square = [];
	this.N = n;
	this.K = k;
	this.log = log || false;

	for (var c = 0; c < this.K; c += 1) {
		this.square.push([]);
		for (var i = 0; i < this.K; i += 1) {
			this.square[c].push({
				value: null,
				pressure: -(this.N - this.K + 1),
				weight: c === i || this.K - c - 1 === i ? 3 : 2
			});
		}
	}

	this.sequences = [];

	for (var c = 0; c < this.K; c += 1) {
		this.sequences.push({
			type: "row",
			id: "row_" + c,
			index: c,
			seq: this.getRow(c)
		});
	}

	for (var c = 0; c < this.K; c += 1) {
		this.sequences.push({
			type: "column",
			id: "column_" + c,
			index: c,
			seq: this.getColumn(c)
		});
	}

	this.sequences.push({
		type: "diagonal",
		id: "diagonal_NW_SE",
		index: "NW_SE",
		seq: this.getDiagonal("NW_SE")
	});

	this.sequences.push({
		type: "diagonal",
		id: "diagonal_NE_SW",
		index: "NE_SW",
		seq: this.getDiagonal("NE_SW")
	});
}

module.exports = Square;

Square.prototype.getRow = function(c) {
	return this.square[c];
};

Square.prototype.setRow = function(seq, c) {
	for (var i = 0; i < seq.length; i += 1) {
		// this.square[c][i].value = seq[i];
		this.square[c][i] = seq[i];
	}
};

Square.prototype.getColumn = function(c) {
	var seq = [];
	for (var i = 0; i < this.square[c].length; i += 1) {
		seq.push(this.square[i][c]);
	}
	return seq;
};

Square.prototype.setColumn = function(seq, i) {
	for (var c = 0; c < seq.length; c += 1) {
		// this.square[c][i].value = seq[c];
		this.square[c][i] = seq[c];
	}
};

Square.prototype.getDiagonal = function(direction) {
	var seq = [];

	for (var c = 0; c < this.square[0].length; c += 1) {
		if (direction == "NW_SE") {
			seq.push(this.square[c][c]);
		} else {
			seq.push(this.square[c][this.square[0].length - c - 1]);			
		}
	}
	return seq;
};


Square.prototype.setDiagonal = function(seq, direction) {
	for (var c = 0; c < seq.length; c += 1) {
		if (direction == "NW_SE") {
			// this.square[c][c].value = seq[c];
			this.square[c][c] = seq[c];
		} else {
			// this.square[c][seq.length - c - 1].value = seq[c];
			this.square[c][seq.length - c - 1] = seq[c];
		}
	}
};

// check for whether an alchemy square is still valid
Square.prototype.audit = function() {
	var valid = true;

	this.sequences.forEach(s => {
		var total = 0;
		s.seq.forEach(d => {
			total += d.value? d.value : 0;			
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
Square.prototype.print = function(w, padding) {
	if (typeof w == "undefined") { w = 5; }
	if (typeof padding == "undefined") { padding = 1; }

	var length = this.K * w + this.K + 1;
	var line = new Array(length).fill("-").join('');
	var blank_row = new Array(this.K).fill("|" + new Array(w).fill(" ").join('')).join('') + "|";

	console.log(line);
	// rows
	for (var c = 0; c < this.K; c += 1) {
		for (var i = 0; i < padding || 0; i += 1) {
			console.log(blank_row);
		}

		var row = this.getRow(c);
		var prettyRow = [];
		for (var i = 0; i < row.length; i += 1) {
			var s = String(row[i].value ? row[i].value : row[i].pressure);
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
		console.log(prettyRow);

		// bottom padding
		for (var i = 0; i < padding || 0; i += 1) {
			console.log(blank_row);
		}
		console.log(line);
	}
};

require("./pressure_A")(Square);