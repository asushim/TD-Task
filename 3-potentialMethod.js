var infCosts = [...costs.map(row => [...row.map(val => new VirtualNumber(0, val)), new VirtualNumber(1, 0)]),
	[...new Array(receivers.length).fill(new VirtualNumber(1, 0)), new VirtualNumber(0, 0)]];

function calcPotentials(basisArray) {
	//const vCosts = costsData.map(row => row.map(el => el == BIGGEST_NUMBER ? new VirtualNumber(1, 0) : new VirtualNumber(0, el)));

	const uArray = new Array(infCosts.length).fill(undefined);
	const vArray = new Array(infCosts[0].length).fill(undefined);

	uArray[0] = new VirtualNumber(0, 0);

	//v - u = c;

	//v = u + c;
	//u = v - c;
	// for(var b = 0; b < 100; b++)
	while(true) {

		basisArray.forEach(el =>{
			const {i, j} = el;
			if(!uArray[i] && vArray[j])
				uArray[i] = vArray[j].sub(infCosts[i][j])
			if(!vArray[j] && uArray[i])
				vArray[j] = uArray[i].add(infCosts[i][j]);
		});

		if(!vArray.some(el => el == undefined) && !uArray.some(el => el == undefined))
			break;
	}

	reportPotentials(uArray, vArray, basisArray);

	return {uArray, vArray};
}

function buildScoringMatrix(uArray, vArray) {

	var scoringMatrix = [];

	for(var i = 0; i < infCosts.length; i++) {
		var row = [];
		for(var j = 0; j < infCosts[0].length; j++)
			row.push(vArray[j].sub(uArray[i]).sub(infCosts[i][j]));
		scoringMatrix.push(row);
	}

	return scoringMatrix;
}

// function buildLoop(i, j, basisArray) {
// 	var points = [];

// 	var currentPos = {i, j};

// 	points.forEach(el => {

// 	});

// 	return points;
// }

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

function rebuildScoringMatrix(scoringMatrix, basisMatrix, cellRow, cellValue) {

	const rowVisited = new Array(scoringMatrix.length).fill(false);
	const colVisited = new Array(scoringMatrix[0].length).fill(false);

	var rows = [cellRow];
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

function potentialMethod(transportData, limitsData, basisMatrix) {

	const s = sum(sendersLeft);

	var basisArray = [];

	for(var i = 0; i < basisMatrix.length; i++)
		for(var j = 0; j < basisMatrix[i].length; j++)
			if(basisMatrix[i][j])
				basisArray.push({i, j});

	const {uArray, vArray} = calcPotentials(basisArray);

	var scoringMatrix = buildScoringMatrix(uArray, vArray, basisArray);
	reportScoringMatrix(scoringMatrix, basisArray);

	print('<h3>Шаг 4: Работа метода потенциалов.</h3>');

	for(var b = 0; b < 100; b++) {

		print('Итерация ' + (b + 1));

		const g0 = findG0Cells(transportData, scoringMatrix);
		const gd = findGdCells(transportData, limitsData, scoringMatrix);

		const merged = [...g0, ...gd];

		if(merged.length == 0) {
			print('Полученное множество пусто, а значит, план оптимален:');
			return transportData;
		}

		let maxValue = undefined;
		let newCell = undefined;

		merged.forEach(el => {
			if(maxValue == undefined || scoringMatrix[el.i][el.j].makeAbs().greater(maxValue.makeAbs())) {
				maxValue = scoringMatrix[el.i][el.j];
				newCell = el;
			}
		});

		print(`Выбираем клетку с наибольшей по модулю оценкой: (${newCell.i + 1};${newCell.j + 1}). Строим от нее цикл по базисным клеткам.`);

		const loop = findLoop(newCell.i, newCell.j, basisMatrix);

		// if(b == 3) {
			// print(createTable(transportData, limits, costs, receivers, senders, basisArray));

		// }

		print(loop.map(el => `(${el.i + 1};${el.j + 1})`).join(' → '));

		const plusMinus = new Array(transportData.length).fill([]).map(() => new Array(transportData[0].length).fill(undefined));
		var iter = newCell.g == '0';
		loop.forEach(el => {
			plusMinus[el.i][el.j] = iter ? '+' : '-';
			iter = !iter;
		});

		var moveSize = BIGGEST_VALUE;
		var oldCell;

		for(var i = 0; i < loop.length; i++) {
			const franxx = loop[i];
			const loopValue = transportData[franxx.i][franxx.j];

			var bool = i % 2;

			if(newCell.g == 'd')
				bool = !bool;

			const current = bool ? loopValue : limitsData[franxx.i][franxx.j] - loopValue;

			if(current < moveSize) {
				moveSize = current;
				oldCell = franxx;
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
			cellIdxes = rebuildScoringMatrix(scoringMatrix, basisMatrix, newCell.i, maxValue);
			basisMatrix[newCell.i][newCell.j] = true;

			basisArray = [];

			for(var i = 0; i < basisMatrix.length; i++)
				for(var j = 0; j < basisMatrix[i].length; j++)
					if(basisMatrix[i][j])
						basisArray.push({i, j});
		}

		reportSpecial2(transportData, customLimits, plusMinus, oldCell, newCell, Math.abs(moveSize),
			basisArray,
			scoringMatrix, cellIdxes, maxValue);

		if(transportData[transportData.length - 1][transportData[0].length - 1] == s &&
			basisArray.filter(el => el.i == transportData.length - 1 || el.j == transportData[0].length - 1).length <= 2) {
			print('Теперь можно убрать фиктивных поставщиков!');
			transportData.pop();
			transportData.forEach(row => row.pop());

			basisMatrix.pop();
			basisMatrix.forEach(row => row.pop());

			customLimits.pop();
			customLimits.forEach(row => row.pop());

			infCosts.pop();
			infCosts.forEach(row => row.pop());

			scoringMatrix.pop();
			scoringMatrix.forEach(row => row.pop());
		}
	}
	// print(basisArray.map(el => `${el.i};${el.j}`).join(', '));
}
