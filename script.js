document.addEventListener('DOMContentLoaded', start);

function start() {
	//Тем кто читает и возможно хочет понять этот код:
	//Игнорьте нахой все функции начинающиеся на report.
	//Они всего лишь выводят (в html) тексты и таблицы.
	//Их код можете найти в файле report.js.
	//Если потереть эти вызовы, прога даже не сломается, ей насрать.
	reportIntro();

	const balanced = sum(senders) == sum(receivers);
	reportBalanced(balanced, sum(senders));

	if(!balanced)
		return;

	buildInitPlan(); //Смотрим объявление в файле initPlan.js
	reportResultTable();

	const rowsCount = senders.length + 1;
	const colsCount = receivers.length + 1;

	//Присобачим фиктивные строки снизу и справа
	const extendedTransports = [...transports.map((row, idx) => [...row, sendersLeft[idx]]), [...receiversLeft, 0]];
	const extendedLimits = [...limits.map((row, idx) => [...row, BIGGEST_VALUE]),  new Array(colsCount).fill(BIGGEST_VALUE)];

	const basisMatrix = selectBasis(extendedTransports, extendedLimits, rowsCount + colsCount - 1);

	const resultPlan = potentialMethod(extendedTransports, extendedLimits, basisMatrix);

	print(createTable(resultPlan, limits, costs, receivers, senders));

	var criteria = 0;

	for (var i = 0; i < resultPlan.length; i++) {
		for (var j = 0; j < resultPlan[i].length; j++) {
			const rs = resultPlan[i][j];
			if(rs > limits[i][j]) {
				print(`Ошибка. Такой план не может быть: в клетке (${i + 1};${j + 1}) значение превышает ограничение!`);
				return;
			}

			if(rs < 0) {
				print(`Ошибка. Такой план не может быть: в клетке (${i + 1};${j + 1}) значение отрицательно!`);
				return;
			}
			criteria += resultPlan[i][j] * costs[i][j];
		}
		if(sum(resultPlan[i]) != senders[i]) {
			print(`Ошибка. Такой план не может быть: в строке ${i + 1} значение не равно лимиту поставщика!`);
			return;
		}
	}

	for(var j = 0; j < resultPlan[0].length; j++) {
		if(sum(resultPlan.map(row => row[j])) != receivers[j]) {
			print(`Ошибка. Такой план не может быть: в стобце ${j + 1} значение не равно лимиту получателя!`);
			return;
		}
	}

	print(`Значение критерия: <b>${criteria}</b>`);
}
