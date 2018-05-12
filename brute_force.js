const fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

if (!argv.N || !argv.K) {
	console.log("Please supply --N and --K");
	return;
}

var N = argv.N; // the total value of the sequence
var K = argv.K; // number of items in the sequence

// We want to look at every combination including repeats -- the "ball-and-urn" problem.
// The not terribly elegant way to do this is just make a set of K instances of each number from 1 to N - K + 1

// https://gist.github.com/axelpale/3118596
function k_combinations(set, k) {
	var i, j, combs, head, tailcombs;
	
	if (k > set.length || k <= 0) {
		return [];
	}
	
	if (k == set.length) {
		return [set];
	}
	
	if (k == 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}
	
	// Assert {1 < k < set.length}
	combs = [];
	for (i = 0; i < set.length - k + 1; i++) {
		head = set.slice(i, i + 1);
		tailcombs = k_combinations(set.slice(i + 1), k - 1);
		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;
}

// http://mathworld.wolfram.com/Combination.html
// number of combos is `N! / K!(N - K)!`
// check to make sure `k_combinations works`
// https://medium.freecodecamp.org/how-to-factorialize-a-number-in-javascript-9263c89a4b38
function factorialize(num) {
	if (num < 0) 
		return -1;
	else if (num == 0) 
		return 1;
	else {
		return (num * factorialize(num - 1));
	}
}

function total_combos(n, k) {
	return factorialize(n) / (factorialize(k) * factorialize(n - k));
}

var upper = N - K + 1;

var set = [];

for (let c = 1; c <= upper; c += 1) {
	for (let i = 0; i < K; i += 1) {
		set.push(c);
	}
}

var lookup = {};

var all_combos = k_combinations(set, K);

all_combos.forEach(combo => {
	combo.sort((a,b) => { return a - b; });
	var sum = combo.reduce((total, num) => {
		return total + num;
	});	
	if (sum === N) {
		var key = combo.join("_");
		if (!lookup[key]) {
			lookup[key] = combo;
		}
	}
});

console.log("Total combinations: ", all_combos.length, total_combos(set.length, K));
console.log("Unique combinations that add up to", N + ":");
console.log(Object.values(lookup));
console.log("(" + Object.values(lookup).length, "total)");

fs.writeFileSync("logs/brute_force_" + N + "_" + K + ".csv", "brute_force\n" + Object.keys(lookup).sort().join("\n"))
