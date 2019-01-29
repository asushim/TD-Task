function reportTable() {
	print(createTable(transports, receivers, senders));
}

function reportResultTable() {

	print('</details>');
	flushBuffer();

	print(`Получаем первоначальный план. Вы можете убедиться в его правильности: ни одна клетка не превышает соответствующего ей значения в таблице d<sub>ij</sub>,
		сумма значений любой строки не превышает лимита соответствующего ПО, а сумма столбца - соответствующего ПН.`);

	reportTable();

	const nds = '<li>' + 
	sendersLeft.map((val, idx) => {return {val, idx}}).filter(el => el.val > 0).map(el => `из ПО №${el.idx + 1} не вывезено ${el.val}`).join(';</li><li>') + ';</li><li>' +
	receiversLeft.map((val, idx) => {return {val, idx}}).filter(el => el.val > 0).map(el => `в ПН №${el.idx + 1} недовезено ${el.val}`).join(';</li><li>') +
	'.</li>';

	print(`Как вы понимаете, первоначальный план - не всегда итоговый. У нас образовался "недовоз":`);

	print(`<ul>${nds}</ul>`);

	var s = sum(receiversLeft);

	print(`Дабы разрешить эту проблему, добавим одного фиктивного поставщика, который "отвезет" груз нашим обделенным получателям. Еще добавим и фиктивного получателя,
		который "примет" груз от неполностью реализовавших себя поставщиков.
		Лимит и того и другого - ${s}, т.к. именно столько груза в сумме не было вывезено/довезено. В результате получим план, который называется искусственным.`);

	var customTransports = [...transports.map((row, idx) => [...row, sendersLeft[idx]]), [...receiversLeft, 0]];

	print(createTable(customTransports, [...receivers, s], [...senders, s]));

	print(`Пропускная способность фиктивных путей неограничена (будем обозначать их как бесконечность символом <i>m</i>.).
		Халявы, однако, не будет - стоимость провоза по таким безграничным путям тоже равна бесконечности, за исключением пути между
		фиктивным поставщиком и потребителем - здесь она ничего не стоит (0).`);

	print(`Если вы еще не поняли, то бесконечная стоимость перевозки объясняется тем, что из реального мира попасть в <del>2D</del> фиктивный нельзя.
		А вот фиктивный ПО к фиктивному ПН может пройти забесплатно.`)

	print(`Поскольку мы не можем предоставить нашему начальству (вы понимаете, о ком я?) план, включающий в себя мистические создания, нужно исправить его при помощи метода потенциалов.
		Суть вот в чем: эта хитрая штука будет ловко перекидывать грузы от фиктивных поставщиков и получателей реальным.
		При этом он будет стремиться распределить как можно больше груза на путях с наименьшей стоимостью. А поскольку у мистических-фиктивных ПО/ПН стоимость бесконечна, от них он избавится
		в первую очередь. Этакий эффективный ребаланс (учись, Blizzard!).`);
}

function reportResultInitPlan(visitedCount, targetCount) {
	if(visitedCount < targetCount)
		print('Построение плана завершено, поскольку дальше двигаться некуда.');
	else
		print(`Построение плана завершено, поскольку мы посетили все ${targetCount} ячеек.`);
}

function reportSwitchPlan(row, idx, dir) {
	print(`Двигаемся ${row ? (dir ? 'вправо' : 'влево') : (dir ? 'вниз' : 'вверх')} по ${row ? 'строке' : 'столбцу'} ${idx + 1}:`);
}

function reportFillPlan(i, j, val) {
	const a = sendersLeft[i] + val;
	const b = receiversLeft[j] + val;
	const c = limits[i][j];
	const minTrans = Math.min(a, b, c);
	
	i += 1; j += 1;

	if(minTrans == 0)
		print(`Переходим в ячейку (${i};${j})`);
	else
		print("X" + i + "" + j + " = min(" + a + ";" + b  + ";" + c + ") = " + minTrans);

	reportFillCell(i - 1, j - 1);
}

function reportFictiveTable() {

}

function reportIntro() {
	print('Терминология:')
	print(`<ul>
		<li><b>ПО</b> - пункт отправления a.k.a поставщик, отправитель.</li>
		<li><b>ПН</b> - пункт назначения, получатель.</li>
		<li><b>Груз</b> - единицы этого мы перевозим.</li>
		<li><b>Лимит</b> - так я называю оставшийся у ПО/ПН груз. Надо бы поменьше в стратежки играть. Обозначется как <b>a<sub>i</sub></b> для ПО и <b>b<sub>j</sub></b> для ПН.</li>
		</ul>`);
 	document.body.innerHTML += '<div style="display: inline-block">' +
 	'Стоимости (c<sub>ij</sub>). В этой таблице показана<br>стоимость провоза по каждому из путей от<br>ПО<sub>i</sub> до ПН<sub>j</sub>. В заголовках таблицы - их<br>лимиты.' +
 	createTable(costs, receivers, senders) +
 	'</div><div style="display: inline-block; margin-left: 20px;">' +
 	'Ограничения (d<sub>ij</sub>). Максимальное<br>кол-во единиц груза, который можно<br>провезти от<br>ПО<sub>i</sub> до ПН<sub>j</sub>.' +
 	createTable(limits) +
 	'</div>';
}

function reportBalanced(balanced, sum) {
	if(balanced)
		print("Сумма лимита ПО = сумма лимита ПН = " + sum + " => задача сбалансирована (весь груз может быть вывезен, все ПН получат груз полностью).");
	else
		print("Задача не сбалансирована");
}

function reportFillCell(i, j) {
	print(createTable(transports, receivers, senders, [{i, j}]));
}

function reportExplainColumnOrRow(row, rowI, rowJ, rowValue, colI, colJ, colValue) {

	print(`Окей, теперь выберем, куда будем двигаться при построении плана: по строке или столбцу?
		Для этого давайте поищем в таблице стоимостей в столбце ${colJ + 1} и строке ${rowI + 1} другие самые дешевые пути.`);

	print('<i>Таблица c<sub>ij</sub></i>')
	print(createTable(costs, undefined, undefined, [{'i':rowI, 'j':rowJ}, {'i':colI, 'j':colJ}]));

	print(`Как вы можете видеть, в столбце самый дешевый путь стоит ${colValue}, а в строке - ${rowValue}.
		Поэтому двигаемся по ${row ? 'строке' : 'столбцу'}.`);

	print(`Таким образом, правила движения просты:<ol>
		<li>выбрать для текущей клетки ее столбец или строку, смотря где есть путь подешевле;</li>
		<li>двигаться по этой строке/столбцу, пока все клетки не будут заполнены или не исчерпается лимит ПО или ПН;</li>
		<li>перейти к пункту 1.</li>
		</ol>`)

	print(`<i>Далее приведено подробное описание построения первоначального плана.
		Гольдштейн - не зверь, и подробно расписывать его с вас, скорее всего, не потребует, поэтому можете переписать только конечный результат</i>`);

	print('<i>Но все равно ознакомьтесь с алгоритмом, ведь ваша главная задача - понять, откуда берется каждая из цифр.</i>')

	enableBuffered();
	print('<details><summary>Построение первоначального плана (развернуть)</summary>');
}

function reportMinPlan1(i, j, firstFill) {

	const a = sendersLeft[i] + firstFill;
	const b = receiversLeft[j] + firstFill;
	const c = limits[i][j];
	const minTrans = Math.min(a, b, c);

	print('<h1>Этап 1: Построение первоначального плана.</h1>')

	print('Какова наша главная цель? Прежде всего, мы хотим по максимуму сэкономить на доставке. Доставка за единицу груза между определенными ПО и ПН указана в таблице c<sub>ij</sub>.')

	print('Исходя из этого, мы будем стараться посылать максимум груза по дешевым путям, и минимум - по дорогим.');

	print(`Давайте начнем. Найдем в таблице c<sub>ij</sub> клетку-путь с минимальными затратами. Нам подходит, например, клетка (${i + 1};${j + 1}).`);

	print('<i>Таблица c<sub>ij</sub></i>')
	print(createTable(costs, undefined, undefined, [{i, j,}]));

	print(`Как вы можете видеть, перевозка между ПО №${i + 1} до ПН №${j + 1} стоит всего лишь ${costs[i][j]}.
		Теперь нам нужно найти, сколько мы можем максимум перевезти по этому пути.`);

	print(`На перевозку действует три ограничения:<ul>
		<li>максимум груза в ПО (как мы видим, это ${a});</li>
		<li>сколько максимум принимает ПН (${b});</li>
		<li>ограничение проп. способности пути от ПО до ПН (смотрите в таблицу d<sub>ij</sub>, это ${c});</li>
		</ul>`)

	print('Понятно, что мы не можем вывезти больше чем есть в ПО, или больше, чем принимает ПН или больше пропускной способности дороги между ними.')

	print(`X<sub>${i + 1}${j + 1}</sub> = min(${a};${b};${c}) = ${minTrans}`);

	print(`Внесем это значение в наш план перевозок:`);
	reportFillCell(i, j);

	print(`<b>Учтите</b>, что мы вычитаем полученное значение из лимита ПО и ПН, поскольку, по факту, мы доставили этот груз.
		Новый лимит ПО №${i + 1} составит ${sendersLeft[i] + firstFill} - ${firstFill} = ${sendersLeft[i]},
		а для ПН №${j + 1} ${receiversLeft[j] + firstFill} - ${firstFill} = ${receiversLeft[j]}`)
}

function reportFucked(howMuch) {
	print(`Не хватает места для ${howMuch} переменных.`);
	print(`Похоже, эта ошибка все таки произошла.
		Пришлите нам на goldislove@mail.ru письмо с темой "ТД калькулятор -
		не хватает места для ${howMuch} переменных" и пришлите входные данные. Постараемся пофиксить и дадим вам знать:)`)
}

function rp1(transportData, basisMatrix) {
	var idxes = []
	for(var i = 0; i < basisMatrix.length; i++)
		for(var j = 0; j < basisMatrix[i].length; j++)
			if(basisMatrix[i][j])
				idxes.push({i, j});


	var s = sum(receiversLeft);

	print(createTable(transportData, [...receivers, s], [...senders, s], idxes));	
}

function reportPotentials1(transportData, basisMatrix) {
	print('<h1>Этап 2: Метод потенциалов.</h1>')
	print('Найдем базисные клетки по условию 0 < xij < dij')
	rp1(transportData, basisMatrix);
}

function reportPotentials2(transportData, basisMatrix, newCells, needed, target) {
	const str = newCells.map(el => `(${el.i + 1};${el.j + 1})`).join(', ');
	print(`Однако базисных клеток должно быть ${target}. Нам не хватает еще ${needed}. Для этого среди оставшихся выделим такие клетки, которые не образуют цикл с другими базисными.`)
	print(`В качестве таких клеток нам подходят: ${str}`);

	rp1(transportData, basisMatrix);
}