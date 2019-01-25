function reportTable() {
	printTable(transports, receivers, senders, receiversLeft, sendersLeft);
}

function reportResultTable() {

	var s = sum(receiversLeft);

	println('Добавим фиктивных поставщиков:');

	var customTransports = [...transports.map((row, idx) => [...row, sendersLeft[idx]]), [...receiversLeft, 0]];

	printTable(customTransports, [...receivers, s], [...senders, s]);
}

function reportSwitchPlan(row, idx) {
	println(`Двигаемся по ${row ? 'строке' : 'столбцу'} ${idx + 1}:`);
}

function reportFillPlan(i, j, val) {
	const a = sendersLeft[i] + val;
	const b = receiversLeft[j] + val;
	const c = limits[i][j];
	const minTrans = Math.min(a, b, c);
	
	i += 1; j += 1;

	if(minTrans == 0)
		println(`Переходим в ячейку (${i};${j})`);
	else
		println("X" + i + "" + j + " = min(" + a + ";" + b  + ";" + c + ") = " + minTrans);

	reportTable();
}

function reportFictiveTable() {

}

function reportIntro() {
	println("Всем привет!");
 	reportTable();
}

function reportBalanced(balanced, sum) {
	if(balanced)
		println("Сумма ПО = сумма ПН = " + sum + " => задача сбалансирована");
	else
		println("Задача не сбалансирована");
}

function reportMinPlan1(i, j) {

	const a = sendersLeft[i];
	const b = receiversLeft[j];
	const c = limits[i][j];
	const minTrans = Math.min(a, b, c);

	i += 1; j += 1;
	println("Одна из клеток с минимальной оценкой имеет индекс ("
		+ i + ";" + j + ")");

	println("X" + i + "" + j + " = min(" + a + ";" + b  + ";" + c + ") = " + minTrans);
}