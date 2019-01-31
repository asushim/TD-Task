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

	var fictiveClosed = false;
	var fictiveRemoved = false;

	for(var b = 0; b < 100; b++) {

		const result = potentialMethodIteration(b, transportData, limitsData, basisMatrix, basisArray, scoringMatrix);

		basisArray = [];

		for(var i = 0; i < basisMatrix.length; i++)
			for(var j = 0; j < basisMatrix[i].length; j++)
				if(basisMatrix[i][j])
					basisArray.push({i, j});

		if(!fictiveClosed && transportData[transportData.length - 1][transportData[0].length - 1] == s) {
			print(`Обратите внимание: фиктивный поставщик замкнулся на фиктивном получателе. Теперь связи между реальным и мистическим миром нет,
				посему план становится допустимым (реальным)${result ? ' и при этом даже оптимальным!' : ', однако, не оптимальным.'}.
				Чтобы безопасно избавиться от этих строк, необходимо, чтобы в них осталось не более двух базисных переменных.`);
			fictiveClosed = true;
		}

		const evangelion = basisArray.filter(el => el.i == transportData.length - 1 || el.j == transportData[0].length - 1).length;

		if(fictiveClosed && !fictiveRemoved && evangelion <= 2) {
			
			print(`В столбце и строке наших фиктивных товарищей находится ${evangelion} переменных. То есть, если мы уберем эти строку и столбец, то количество базисных переменных
				останется равным кол-ву ПО + кол-ву ПН - 1. Поэтому давайте сделаем это.`);

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
			fictiveRemoved = true;
		}

		if(result)
			return transportData;
	}
	// print(basisArray.map(el => `${el.i};${el.j}`).join(', '));
}
