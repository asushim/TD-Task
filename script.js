document.addEventListener('DOMContentLoaded', start);

function start() {
	//Тем кто читает и возможно хочет понять этот код:
	//Можете не брать во внимание все функции, начинающиеся на report.
	//Они всего лишь выводят (в html) тексты и таблицы.
	//Их код можете найти в файле report.js.
	//Если потереть эти вызовы, прога даже не сломается.
	reportIntro();

	if(!checkValid())
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

	checkIsRealPlan(resultPlan);

	print(createTable(resultPlan, limits, costs, receivers, senders));

	checkValidResultPlan(resultPlan);

	var criteria = 0;

	for (var i = 0; i < resultPlan.length; i++)
		for (var j = 0; j < resultPlan[i].length; j++)
			criteria += resultPlan[i][j] * costs[i][j];

	print(`Значение критерия: <b>${criteria}</b>`);
}
