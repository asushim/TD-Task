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
		return;

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

	fillCell(i, j)
	reportTable();

	const bI = findBestCell(costs.column(j), visited.column(j), sendersLeft, i);
	const bJ = findBestCell(costs[i], visited[i], receiversLeft, j);

	var startWithCol = costs[bI][j] < costs[i][bJ];

	var targetCount = senders.length * receivers.length;

	while((i || j) && (visitedCount < targetCount)) {

		var firstIter = true;

		while(sendersLeft[i] != 0 || firstIter) {
			if(startWithCol) {
				startWithCol = false;
				break;
			}

			const nextJ = findBestCell(costs[i], visited[i], receiversLeft, j);

			if(nextJ == undefined) {
				// closeRow(i);
				break;
			}

			if(firstIter)
				reportSwitchPlan(true, i);

			var val = fillCell(i, nextJ);

			if(val == 0) {
				if(firstIter) {
					j = nextJ;
					reportFillPlan(i, j, val)
				}
				break;
			}

			j = nextJ;

			reportFillPlan(i, j, val);
			firstIter = false;
		}

		firstIter = true;

		while(receiversLeft[j] != 0 || firstIter) {
			nextI = findBestCell(costs.column(j), visited.column(j), sendersLeft, i);

			if(nextI == undefined) {
				// closeColumn(j);
				break;
			}

			if(firstIter)
				reportSwitchPlan(false, j);

			var val = fillCell(nextI, j);

			if(val == 0) {
				if(firstIter) {
					i = nextI;
					reportFillPlan(i, j, val)
				}
				break;
			}

			i = nextI;

			reportFillPlan(i, j, val);
			firstIter = false;
		}
	}

	if(visitedCount < targetCount)
		println('Построение плана завершено, поскольку дальше двигаться некуда.');
	else
		println(`Построение плана завершено, поскольку мы посетили все ${targetCount} ячеек.`);
}
