const exampleSenders = [50, 20, 30, 40];
const exampleReceivers = [30, 65, 20, 10, 15];
const exampleCosts = [
	[10, 2, 5, 10, 14],
	[5, 4, 11, 3, 11],
	[8, 12, 1, 18, 9],
	[4, 9, 17, 18, 1]
	]
const exampleLimits = [
	[35, 14, 10, 5, 15],
	[4, 20, 12, 18, 8],
	[7, 32, 20, 14, 10],
	[4, 16, 20, 17, 8]
	]

function checkThisShit() {
	if(senders.length != exampleSenders.length  || receivers.length != exampleReceivers.length)
		return false;

	for(var i = 0; i < exampleSenders.length; i++)
		if(exampleSenders[i] != senders[i])
			return false;

	for(var i = 0; i < exampleReceivers.length; i++)
		if(exampleReceivers[i] != receivers[i])
			return false;

	for(var i = 0; i < exampleCosts.length; i++) {
		for(var j = 0; j < exampleCosts[i].length; j++) {
			if(exampleCosts[i][j] != costs[i][j] || exampleLimits[i][j] != limits[i][j])
				return false;
		}
	}

	return true;
}