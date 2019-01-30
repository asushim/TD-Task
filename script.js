document.addEventListener('DOMContentLoaded', start);

function start() {
	//Тем кто читает и возможно хочет понять этот код:
	//Можете не брать во внимание все функции, начинающиеся на report.
	//Они всего лишь выводят (в html) тексты и таблицы.
	//Их код можете найти в файле report.js.
	//Если потереть эти вызовы, прога даже не сломается.
	reportIntro();

	for(var i = 0; i < senders.length; i++) {
		if(senders[i] < 0) {
			print(`Ошибка. Некорректные данные: в строке ${i + 1} значение лимита поставщика отрицательно.`);
		}
	}

	for(var j = 0; j < receivers.length; j++) {
		if(receivers[j] < 0) {
			print(`Ошибка. Некорректные данные: в столбце ${j + 1} значение лимита получателя отрицательно.`);
		}
	}

	const balanced = sum(senders) == sum(receivers);
	reportBalanced(balanced, sum(senders));

	if(!balanced)
		return;

	for(var i = 0; i < limits.length; i++) {
		for(var j = 0; j < limits[0].length; j++) {
			if(costs[i][j] < 0) {
				print(`Ошибка. Некорректные данные: в клетке таблицы стоимостей (${i + 1};${j + 1}) значение отрицательно.`);
				return;
			}

			if(limits[i][j] < 0) {
				print(`Ошибка. Некорректные данные: в клетке таблицы ограничений (${i + 1};${j + 1}) значение отрицательно.`);
				return;
			}
		}
	}

	for(var i = 0; i < limits.length; i++) {
		if(sum(limits[i]) < senders[i]) {
			print(`Ошибка. Некорректные данные: в строке ${i + 1} сумма пропускных способностей дорог меньше лимита отправителя. В результате он не сможет реализовать весь груз.`);
			return;
		}
	}

	for(var j = 0; j < limits[0].length; j++) {
		if(sum(limits.map(row => row[j])) < receivers[j]) {
			print(`Ошибка. Некорректные данные: в стобце ${j + 1} сумма пропускных способностей дорог меньше лимита получателя. В результате он не сможет получить весь груз.`);
			return;
		}
	}

	buildInitPlan(); //Смотрим объявление в файле initPlan.js
	reportResultTable();

	const rowsCount = senders.length + 1;
	const colsCount = receivers.length + 1;

	//Присобачим фиктивные строки снизу и справа
	const extendedTransports = [...transports.map((row, idx) => [...row, sendersLeft[idx]]), [...receiversLeft, 0]];
	const extendedLimits = [...limits.map((row, idx) => [...row, BIGGEST_VALUE]),  new Array(colsCount).fill(BIGGEST_VALUE)];

	const basisMatrix = selectBasis(extendedTransports, extendedLimits, rowsCount + colsCount - 1);

	const resultPlan = potentialMethod(extendedTransports, extendedLimits, basisMatrix);

	if(resultPlan.length != senders.length) {
		print(`<p>Ошибка. Согласно расчетам, план является оптимальным, однако, от фиктивных поставщика и получателя мы не избавились.</p>
			<p>План нереален. Пожалуйста, сообщите нам свои входные данные, чтобы помочь выявить баг.</p>`);
		return;
	}

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
