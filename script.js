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

	var customTransports = [...transports.map((row, idx) => [...row, sendersLeft[idx]]), [...receiversLeft, 0]];

	var cLimits = [...limits.map((row, idx) => [...row, BIGGEST_VALUE]),  new Array(colsCount).fill(BIGGEST_VALUE)];

	const basisArray = selectBasis(customTransports, cLimits, rowsCount + colsCount - 1);
}