function findG0Cells(transportData, scoringMatrix) {
	var g0 = [];

	for(var i = 0; i < transportData.length; i++)
		for(var j = 0; j < transportData[i].length; j++)
			if(transportData[i][j] == 0 && scoringMatrix[i][j].greater(0))
				g0.push({i, j, g:'0'});

	return g0;
}

function findGdCells(transportData, limitsData, scoringMatrix) {
	var gd = [];

	for(var i = 0; i < transportData.length; i++)
		for(var j = 0; j < transportData[i].length; j++)
			if(transportData[i][j] == limitsData[i][j] && scoringMatrix[i][j].less(0))
				gd.push({i, j, g:'d'});

	return gd;
}

function rebuildScoringMatrix(scoringMatrix, basisMatrix, cell) {

	const cellValue = scoringMatrix[cell.i][cell.j];

	const rowVisited = new Array(scoringMatrix.length).fill(false);
	const colVisited = new Array(scoringMatrix[0].length).fill(false);

	var rows = [cell.i];
	var cols = [];

	var cellIdxes = [];

	while(true) {
		rows.forEach(i => {
			for(var j = 0; j < scoringMatrix[i].length; j++) {
				if(!colVisited[j] && basisMatrix[i][j])
					cols.push(j);

				scoringMatrix[i][j] = scoringMatrix[i][j].sub(cellValue);
				cellIdxes.push({i, j, g: 'red'});
			}
			rowVisited[i] = true;
		});

		if(cols.length == 0)
			break;

		rows = [];

		cols.forEach(j => {
			for(var i = 0; i < scoringMatrix.length; i++) {
				if(!rowVisited[i] && basisMatrix[i][j])
					rows.push(i);

				scoringMatrix[i][j] = scoringMatrix[i][j].add(cellValue);
				cellIdxes.push({i, j, g: 'red'});
			}
			colVisited[j] = true;
		});

		if(rows.length == 0)
			break;

		cols = [];
	}

	return cellIdxes;
}

function findMaxScore(set, scoringMatrix) {
	let maxValue = undefined;
	let newCell = undefined;

	//Выбираем клетку с наиб. по модулю оценкой.
	set.forEach(el => {
		if(maxValue == undefined || scoringMatrix[el.i][el.j].makeAbs().greater(maxValue.makeAbs())) {
			maxValue = scoringMatrix[el.i][el.j];
			newCell = el;
		}
	});
	return newCell;
}

function potentialMethodIteration(iter, transportData, limitsData, basisMatrix, basisArray, scoringMatrix) {
	var currrrrriter = iter;
	print('Итерация ' + (iter + 1));

	const g0 = findG0Cells(transportData, scoringMatrix);
	const gd = findGdCells(transportData, limitsData, scoringMatrix);

	if(iter == 0){
		reportPotentialIter1(g0, gd);
	} else {
		const g0str = g0.map(el => `(${el.i + 1};${el.j + 1})`).join(', ');
		const gdstr = gd.map(el => `(${el.i + 1};${el.j + 1})`).join(', ');

		print(`<font color='green'>G<sub>0</sub></font> = {<i>i,j</i> : x<sub><i>i,j</i></sub> = 0, △<sub><i>i,j</i></sub> > 0}</b> = { ${g0str} }`);
		print(`<font color='blue'>G<sub>d</sub></font> = {<i>i,j</i> : x<sub><i>i,j</i></sub> = d<sub><i>i,j</i></sub>, △<sub><i>i,j</i></sub> < 0}</b> = { ${gdstr} }`);

	}

	const merged = [...g0, ...gd];

	if(merged.length == 0) {
		print('Полученное множество пусто, а значит, план оптимален:');
		return true;
	}

	const newCell = findMaxScore(merged, scoringMatrix);

	if(iter == 0)
		reportPotentialIter1_2(newCell);
	else
		print(`Выбираем из <font color='green'>G<sub>0</sub></font> и <font color='blue'>G<sub>d</sub></font> клетку с наибольшей по модулю оценкой: это (${newCell.i + 1};${newCell.j + 1}).
			Строим от нее цикл пересчета по базисным клеткам.`);

	//Строим цикл пересчета.
	const loop = findLoop(newCell.i, newCell.j, basisMatrix);

	var iter = newCell.g == 'd';
	print(loop.map(el => `(${el.i + 1};${el.j + 1})(${(iter = !iter) ? '+' : '-'})`).join(' → '));

	iter = !iter;

	const plusMinus = new Array(transportData.length).fill([]).map(() => new Array(transportData[0].length).fill(undefined));

	loop.forEach(el => {
		plusMinus[el.i][el.j] = iter ? '+' : '-';
		iter = !iter;
	});

	var moveSize = BIGGEST_VALUE;
	var oldCell;

	console.log(currrrrriter+1)
	console.log(`G${newCell.g}`)
	for(var i = 0; i < loop.length; i++) {
		const franxx = loop[i];
		const loopValue = transportData[franxx.i][franxx.j];

		var bool = i % 2;

		if(newCell.g == 'd')
			bool = !bool;

		const current = bool ? loopValue : limitsData[franxx.i][franxx.j] - loopValue;

		if(current < moveSize) {
			console.log(`i=${franxx.i+1}, j=${franxx.j+1} record from ${moveSize} to ${current}, bool=${bool}`)
			moveSize = current;
			oldCell = franxx;
		} else {
			console.log(`i=${franxx.i+1}, j=${franxx.j+1} record ${moveSize} not changed, current=${current}, bool=${bool}`)
		}
	}

	if(newCell.g == 'd')
		moveSize = -moveSize;

	reportSpecial(transportData, scoringMatrix, merged, plusMinus, oldCell, [...basisArray, {i:newCell.i, j:newCell.j, g:'border'}]);

	loop.forEach(el => {
		transportData[el.i][el.j] += moveSize;
		moveSize = -moveSize;
	});

	var cellIdxes;

	if(newCell.i != oldCell.i || newCell.j != oldCell.j){
		basisMatrix[oldCell.i][oldCell.j] = false;
		cellIdxes = rebuildScoringMatrix(scoringMatrix, basisMatrix, newCell);
		basisMatrix[newCell.i][newCell.j] = true;

		basisArray = [];

		for(var i = 0; i < basisMatrix.length; i++)
			for(var j = 0; j < basisMatrix[i].length; j++)
				if(basisMatrix[i][j])
					basisArray.push({i, j});
	}

	reportSpecial2(transportData, customLimits, plusMinus, oldCell, newCell, Math.abs(moveSize), basisArray, scoringMatrix, cellIdxes);

	return false;
}
