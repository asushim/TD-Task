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