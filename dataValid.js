function checkValid() {
	for(var i = 0; i < senders.length; i++) {
		if(senders[i] < 0) {
			print(`Ошибка. Некорректные данные: в строке ${i + 1} значение лимита поставщика отрицательно.`);
			return false;
		}
	}

	for(var j = 0; j < receivers.length; j++) {
		if(receivers[j] < 0) {
			print(`Ошибка. Некорректные данные: в столбце ${j + 1} значение лимита получателя отрицательно.`);
			return false;
		}
	}

	const balanced = sum(senders) == sum(receivers);
	reportBalanced(balanced, sum(senders));

	if(!balanced)
		return false;

	for(var i = 0; i < limits.length; i++) {
		for(var j = 0; j < limits[0].length; j++) {
			if(costs[i][j] < 0) {
				print(`Ошибка. Некорректные данные: в клетке таблицы стоимостей (${i + 1};${j + 1}) значение отрицательно.`);
				return false;
			}

			if(limits[i][j] < 0) {
				print(`Ошибка. Некорректные данные: в клетке таблицы ограничений (${i + 1};${j + 1}) значение отрицательно.`);
				return false;
			}
		}
	}

	for(var i = 0; i < limits.length; i++) {
		if(sum(limits[i]) < senders[i]) {
			print(`Ошибка. Некорректные данные: в строке ${i + 1} сумма пропускных способностей дорог меньше лимита отправителя. В результате он не сможет реализовать весь груз.`);
			return false;
		}
	}

	for(var j = 0; j < limits[0].length; j++) {
		if(sum(limits.map(row => row[j])) < receivers[j]) {
			print(`Ошибка. Некорректные данные: в стобце ${j + 1} сумма пропускных способностей дорог меньше лимита получателя. В результате он не сможет получить весь груз.`);
			return false;
		}
	}
	
	return true;
}

function checkIsRealPlan(resultPlan) {
	if(resultPlan.length != senders.length) {
		print(`<p>Ошибка. Согласно расчетам, план является оптимальным, однако, от фиктивных поставщика и получателя мы не избавились.</p>
			<p>План нереален. Пожалуйста, сообщите нам свои входные данные, чтобы помочь выявить баг.</p>`);
		return false;
	}
}

function checkValidResultPlan(resultPlan) {
	for (var i = 0; i < resultPlan.length; i++) {
		for (var j = 0; j < resultPlan[i].length; j++) {
			const rs = resultPlan[i][j];
			if(rs > limits[i][j]) {
				print(`Ошибка. Такой план не может быть: в клетке (${i + 1};${j + 1}) значение превышает ограничение!`);
				return false;
			}

			if(rs < 0) {
				print(`Ошибка. Такой план не может быть: в клетке (${i + 1};${j + 1}) значение отрицательно!`);
				return false;
			}
		}
		if(sum(resultPlan[i]) != senders[i]) {
			print(`Ошибка. Такой план не может быть: в строке ${i + 1} значение не равно лимиту поставщика!`);
			return false;
		}
	}

	for(var j = 0; j < resultPlan[0].length; j++) {
		if(sum(resultPlan.map(row => row[j])) != receivers[j]) {
			print(`Ошибка. Такой план не может быть: в стобце ${j + 1} значение не равно лимиту получателя!`);
			return false;
		}
	}
}