var getRandom = function(arr) {
	return arr[Math.floor(Math.random() * arr.length)]
};


var getRandomN = function(n) {
	return Math.floor(Math.random() * (n - 1)) + 1;
};

module.exports = function(Square) {

	// set the value of a tile and update the pressure
	Square.prototype.setSequence = function(seq_id) {
		var p = this.square[c][i].pressure;
		if (p > 0) {
			console.log("Error: You can't set the value of a tile", c, i, "because is has a positive pressure of", p);
			return false;
		}
		this.square[c][i].value = getRandomN(-p);
		this.square[c][i].pressure = 0;

		console.log("Replaced", p, "at", c, i, "with", this.square[c][i].value);

		return this.updatePressure();
	}

	// for a given sequence, update the pressure values based on the values
	// if only one null value remains, fill it in with the remaining pressure
	// often a spot will have different pressures from different directions. We always default to the lowest value

	Square.prototype.setPressure = function(seq, id) {
		var total = 0;
		var filled = seq.filter(d => { return d.value && d.value > 0; });
		var unfilled = seq.filter(d => { return d.value <= 0; });
		var that = this;

		if (filled.length) {
			filled.forEach(d => {
				total += d.value;
			});
		}

		var remaining = -(this.N - total - unfilled.length + 1);

		if (remaining >= 0) {
			console.log("ERROR: No pressure left in", id);
			return null;
		}

		// don't bother if this sequence is all filled-in
		if (filled.length === this.K && remaining === 0) {
			return {
				seq: seq,
				remaining: 0,
				modified: false,
				unfilled_count: 0
			};
		}

		// if only one remaining value, fill it in
		if (unfilled.length === 1) {
			seq.forEach(d => {
				if (!d.value) {
					d.value = -remaining;
					d.pressure = 0;
				}
			});
			console.log("Only one remaining value in", id + ". Setting to", -remaining);

			return {
				seq: seq,
				remaining: 0,
				modified: true,
				unfilled_count: 0
			};
		}	

		// var modified = false;

		// if there's pressure, set it if it's higher than the pre-existing pressure
		if (remaining < 0) {
			seq.forEach(d => {
				if (d.pressure < remaining) {
					if (that.log) {
						console.log(d.pressure, "Updating pressure", remaining);
					}
					d.pressure = remaining;
					// modified = true;
				}
				return d;
			});
		}

		// re-check whether new sequence is valid
		filled = seq.filter(d => { return d.value && d.value > 0; });
		unfilled = seq.filter(d => { return d.value < 0; });
		total = 0;

		if (filled.length) {
			filled.forEach(d => {
				total += d.value? d.value : 0;			
			});

			if (filled.length == this.K && total != this.N) {
				console.log("ERROR: Sequence at", id, "does not equal", this.N);
				return null;
			}
		}

		// console.log("RETURNING Sequence", seq)
		return {
			seq: seq,
			remaining: remaining,
			modified: false,
			unfilled_count: unfilled.length
		};
	};


	// update the pressure for each empty value
	Square.prototype.updatePressure = function() {
		// update pressure for rows, columns and diagonals
		for (var c = 0; c < this.sequences.length; c += 1) {
			var s = this.sequences[c];

			if (this.log) {
				console.log("Checking pressure at", s.id);
				// console.log(s.seq);
			}
			var leftover = this.setPressure(s.seq, s.id);

			if (leftover === null) {
				return null;
			}

			// if we updated a value, restart the pressure calculation
			if (leftover.modified) {
				if (this.log) {
					console.log("New sequence at", s.id);
					console.log(leftover.seq);
					console.log("Back to the beginning");
				}
				c = -1;
			}
		}

		return true;
	};


	// look at every tile and find the one with the lowest pressure
	Square.prototype.findLowestPressure = function() {
		var lowest = null;
		var x = null;
		var y = null;
		var weight = null;
		var fatal = false;
		for (var c = 0; c < this.K; c += 1) {
			for (var i = 0; i < this.K; i += 1) {
				var p = this.square[c][i].pressure;
				if (p === null) {
					continue;
				}

				if (lowest === null) {
					lowest = p;
					x = c;
					y = i;
					weight = square[c][i].weight;
				}

				if (this.square[c][i].weight > weight || p > lowest) {
					lowest = p;
					x = c;
					y = i;
					weight = square[c][i].weight;
				}
			}
		}
		if (fatal) {
			print();
			console.log("Game over");
			return null;
		}
		return {
			pressure: lowest,
			x: x,
			y: y
		};
	}
}