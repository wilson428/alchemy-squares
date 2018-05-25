module.exports = {}

var getRandom = function(arr) {
	return arr[Math.floor(Math.random() * arr.length)]
};
module.exports.getRandom = getRandom;

var getEmptySquare = function(K) {
	var square = [];
	for (var c = 0; c < K; c += 1) {
		square.push(Array(K).fill(null));
	}
	return square;
};
module.exports.getEmptySquare = getEmptySquare;

var getRow = function(square, c) {
	return square[c];
};
module.exports.getRow = getRow;

var setRow = function(square, seq, c) {
	square[c] = seq;
	return square;
};
module.exports.setRow = setRow;

var getColumn = function(square, c) {
	var seq = [];
	for (var i = 0; i < square[c].length; i += 1) {
		seq.push(square[i][c]);
	}
	return seq;
};
module.exports.getColumn = getColumn;

var setColumn = function(square, seq, c) {
	for (var i = 0; i < seq.length; i += 1) {
		square[i][c] = seq[i];
	}
	return square;
};
module.exports.setColumn = setColumn;

var getDiagonals = function(square) {
	var seq = {
		NW_SE: [],
		NE_SW: []
	};

	for (var c = 0; c < square[0].length; c += 1) {
		seq.NW_SE.push(square[c][c]);
		seq.NE_SW.push(square[c][square[0].length - c - 1]);
	}

	return seq;
};
module.exports.getDiagonals = getDiagonals;

var setDiagonal = function(square, seq, direction) {
	for (var c = 0; c < seq.length; c += 1) {
		if (direction == "NW_SE") {
			square[c][c] = seq[c];
		} else {
			square[c][seq.length - c - 1] = seq[c];
		}
	}
	return square;
};
module.exports.setDiagonal = setDiagonal;


// fill in blank spots in a seq with the remaining values
var getPressure = function(seq, N) {
	var filled = seq.filter(d => { return d > 0; });
	var total = 0;

	if (filled.length) {
		total = filled.reduce((a, c) => { return a + c; });
	}

	var remaining = total - N;

	// if there's pressure, add it to any existing pressure
	if (remaining < 0) {
		seq = seq.map(d => {
			if (!d) {
				d = remaining;
			} else if (d <= 0) {
				d += remaining;
			}
			return d;
		});
	}
	// console.log(seq);
	return {
		seq: seq,
		remaining: remaining
	};
};
module.exports.getPressure = getPressure;


// update the pressure for each empty value
// often a spot will have different pressures from different directions
var setPressure = function(square, N, K) {
	var rows = [];
	var columns = [];
	var diagonals = {};

	// first, replace all existing pressure with null
	for (var c = 0; c < K; c += 1) {
		for (var i = 0; i < K; i += 1) {
			if (!square[c][i] || square[c][i] < 0) {
				square[c][i] == null;
			}
		}
	}


	// rows 
	for (var c = 0; c < K; c += 1) {
		var leftover = getPressure(getRow(square, c), N);
		rows.push(leftover.remaining);
		if (leftover.remaining < 0) {
			square = setRow(square, leftover.seq, c);
		}
	}	

	// columns 
	for (var c = 0; c < K; c += 1) {
		var column = getColumn(square, c);
		var leftover = getPressure(column, N);
		columns.push(leftover.remaining);
		if (leftover.remaining < 0) {			
			square = setColumn(square, leftover.seq, c);
		}
	}


	// diagonals
	var diags = getDiagonals(square);
	var pressure_NW_SE = getPressure(diags.NW_SE, N);
	var pressure_NE_SW = getPressure(diags.NE_SW, N);

	diagonals.NW_SE = pressure_NW_SE.remaining;
	diagonals.NE_SW = pressure_NE_SW.remaining;

	square = setDiagonal(square, pressure_NW_SE.seq, "NW_SE");
	square = setDiagonal(square, pressure_NE_SW.seq, "NE_SW");

	return {
		square: square,
		rows: rows,
		columns: columns,
		diagonals: diagonals
	};
};
module.exports.setPressure = setPressure;

// w is width of row in ASCII
// padding is number of empty rows to put above and below
var print = function(square, w, padding) {
	var length = square[0].length * w + square[0].length + 1;
	var line = new Array(length).fill("-").join('');
	var blank_row = new Array(square[0].length).fill("|" + new Array(w).fill(" ").join('')).join('') + "|";

	console.log(line);
	// rows
	for (var c = 0; c < square[0].length; c += 1) {
		for (var i = 0; i < padding || 0; i += 1) {
			console.log(blank_row);
		}

		var row = square[c];
		var prettyRow = [];
		for (var i = 0; i < row.length; i += 1) {
			var s = String(row[i]);
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
module.exports.print = print;