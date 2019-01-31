var visited = new Array(senders.length).fill(false).map(() => new Array(receivers.length).fill(false));
var visitedCount = 0;

var sendersLeft = senders.slice();
var receiversLeft = receivers.slice();
var transports = new Array(senders.length).fill(0).map(() => new Array(receivers.length).fill(0));

function findFirstIdx() {
	var min = BIGGEST_VALUE;
	var minIdx;
	for(var i = 0; i < costs.length; i++) {
		var row = costs[i];
		for(var j = 0; j < row.length; j++) {
			if(row[j] <= min) {
				min = row[j];
				minIdx = {i, j};
			}
		}
	}
	return minIdx;
}

function findBestCell(costsCells, visCells, limiters) {
	var min = BIGGEST_VALUE;
	var minIdx;
	for(var i = 0; i < costsCells.length; i++) {
		if(visCells[i] || limiters == 0) continue;

		if(costsCells[i] <= min) {
			min = costsCells[i];
			minIdx = i;
		}
	}
	return minIdx;
}

function fillCell(i, j) {
	if(visited[i][j])
		return 0;

	visited[i][j] = true;
	visitedCount++;
	
	const a = sendersLeft[i];
	const b = receiversLeft[j];
	const c = limits[i][j];

	const minTrans = Math.min(a, b, c);

	transports[i][j] = minTrans;

	sendersLeft[i] -= minTrans;
	receiversLeft[j] -= minTrans;
	return minTrans;
}

function buildInitPlan() {
	var {i, j} = findFirstIdx();

	reportMinPlan1(i, j);
	const firstFill = fillCell(i, j)
	reportMinPlan2(i, j, firstFill);

	const bI = findBestCell(costs.column(j), visited.column(j), sendersLeft, i);
	const bJ = findBestCell(costs[i], visited[i], receiversLeft, j);

	var startWithCol = costs[bI][j] < costs[i][bJ];

	reportExplainColumnOrRow(!startWithCol, i, bJ, costs[i][bJ], bI, j, costs[bI][j])

	var targetCount = senders.length * receivers.length;

	var prevI = undefined;
	var prevJ = undefined;

	while((i || j) && (i != prevI || j != prevJ) && (visitedCount < targetCount)) {

		prevI = i;
		prevJ = j;

		var firstIter = true;

		var nextI, nextJ;

		while(sendersLeft[i] != 0 || firstIter) {
			if(startWithCol) {
				startWithCol = false;
				break;
			}

			nextJ = findBestCell(costs[i], visited[i], receiversLeft, j);

			if(nextJ == undefined) {
				// closeRow(i);
				break;
			}

			// if(firstIter)
				

			var val = fillCell(i, nextJ);

			if(val == 0) {
				if(firstIter) {
					reportSwitchPlan(true, i, nextJ > j);
					j = nextJ;
					reportFillPlan(i, j, val)
				}
				break;
			}

			reportSwitchPlan(true, i, nextJ > j);
			j = nextJ;
			reportFillPlan(i, j, val);
			firstIter = false;
		}

		if(sendersLeft[i] == 0)
			reportSwitch(true, i);
		else
			if(nextJ == undefined)
				reportNowhere(true, i);	

		firstIter = true;

		while(receiversLeft[j] != 0 || firstIter) {
			nextI = findBestCell(costs.column(j), visited.column(j), sendersLeft, i);

			if(nextI == undefined) {
				// closeColumn(j);
				break;
			}

			// if(firstIter)

			var val = fillCell(nextI, j);

			if(val == 0) {
				if(firstIter) {
					reportSwitchPlan(false, j, nextI > i);
					i = nextI;
					reportFillPlan(i, j, val)
				}
				break;
			}

			reportSwitchPlan(false, j, nextI > i);
			i = nextI;
			reportFillPlan(i, j, val);
			firstIter = false;
		}

		if(receiversLeft[j] == 0)
			reportSwitch(false, j);
		else
			if(nextI == undefined)
				reportNowhere(false, j);
	}
	
	reportResultInitPlan(visitedCount, targetCount);
}
