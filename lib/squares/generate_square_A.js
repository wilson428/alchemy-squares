const fs = require('fs');
const Square = require('./Square_A');

function randomTree(N, K, log) {
	var s = new Square(N, K, log);

	s.setTile(0, 0);

	s.print();

	process.stdin.on('data', function () {
		var lowest = s.findLowestPressure();

		console.log("Lowest value is", lowest.pressure, "at", lowest.x, lowest.y);

		if (lowest.pressure === null) {
			console.log("DONE!");
			fs.writeFileSync("./logs/square_" + s.serialize() + ".txt", s.print());
			process.stdin.pause();
			return;
		}

		var pressure = s.setTile(lowest.x, lowest.y);

		s.print();

		if (pressure === null) {
			console.log("No luck! Goodbye.");
			process.stdin.pause();
			return;
		}
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
	var log = argv.hasOwnProperty("log");
	randomTree(N, K, log);

}



module.exports = function(N, K, write) {

}