function reportIntro() {
	print('Терминология:')
	print(`<ul>
		<li><b>ПО</b> - пункт отправления a.k.a поставщик, отправитель.</li>
		<li><b>ПН</b> - пункт назначения, получатель.</li>
		<li><b>Груз</b> - единицы этого мы перевозим.</li>
		<li><b>Лимит</b> - так я называю количество груза, которое может вывезти <i>i</i>-ый ПО и принимает <i>j</i>-ый ПН. Обозначется как <b>a<sub>i</sub></b> для ПО и <b>b<sub>j</sub></b> для ПН.</li>
		</ul>`);
 	document.body.innerHTML += '<div style="display: inline-block">' +
 	'<font color="blue">Стоимости</font> (<font color="blue">затраты</font>) <font color="blue">c<sub>ij</sub></font>. В этой таблице показаны <font color="blue">стоимости</font><br>провоза по каждому из путей от ПО<sub>i</sub> до ПН<sub>j</sub>.' +
 	createTable(costs, undefined, undefined, receivers, senders) +
 	'</div><div style="display: inline-block; margin-left: 20px;">' +
 	'<font color="#854325">Ограничения</font> <font color="#854325">d<sub>ij</sub></font>. Максимальное кол-во единиц груза,<br>который можно провезти по каждому из путей от ПО<sub>i</sub> до ПН<sub>j</sub>.' +
 	createTable(limits, undefined, undefined, receivers, senders) +
 	'</div>';

 	print('В заголовках таблиц по вертикали указаны лимиты для ПО, по горизонтали - для ПН');

 	print('Td-задача решается в два этапа:');
 	print(`<ul>
 		Первый - построение первоначального плана. С высокой вероятностью он получится не только неоптимальным, но даже нереальным.<br>
 		Второй - поиск оптимального плана при помощи метода потенциалов. Используя первоначальный план как точку отправления, мы за конечное число итераций
 		придем к правильному результату;
 		</ul>`);
}

function reportBalanced(balanced, sum) {
	if(balanced)
		print("Сумма лимита ПО = сумма лимита ПН = " + sum + " => задача сбалансирована (весь груз может быть вывезен, все ПН получат груз полностью).");
	else
		print("Задача не сбалансирована");
}

const customLimits = [...limits.map((row, idx) => [...row, inf]), new Array(receivers.length + 1).fill(inf)];
// const infCosts = [...costs.map((row, idx) => [...row, inf]), [...new Array(receivers.length).fill(inf), '0']];

function reportTable() {
	print(createTable(transports, limits, costs, receivers, senders));
}

function repExtendedTable() {

	const s = sum(receiversLeft);
	const customTransports = [...transports.map((row, idx) => [...row, sendersLeft[idx]]), [...receiversLeft, 0]];
	print(createTable(customTransports, customLimits, infCosts, [...receivers, s], [...senders, s]));
}

function reportResultTable() {

	print('</details>');
	flushBuffer();

	print(`Получаем первоначальный план. Вы можете убедиться в его правильности: ни одна клетка не превышает соответствующего ей значения в таблице <font color="#854325">d<sub>ij</sub></font>,
		сумма значений любой строки не превышает лимита соответствующего ПО, а сумма столбца - соответствующего ПН.`);

	reportTable();

	const nds = '<li>' + 
	sendersLeft.map((val, idx) => {return {val, idx}}).filter(el => el.val > 0).map(el => `из ПО №${el.idx + 1} не вывезено ${el.val}`).join(';</li><li>') + ';</li><li>' +
	receiversLeft.map((val, idx) => {return {val, idx}}).filter(el => el.val > 0).map(el => `в ПН №${el.idx + 1} недовезено ${el.val}`).join(';</li><li>') +
	'.</li>';

	print(`Как вы понимаете, первоначальный план - не всегда итоговый. У нас образовался "недовоз":`);

	print(`<ul>${nds}</ul>`);

	print(`Дабы разрешить эту проблему, добавим одного фиктивного поставщика, который "отвезет" груз нашим обделенным получателям. Еще добавим и фиктивного получателя,
		который "примет" груз от неполностью реализовавших себя поставщиков.
		Лимит и того и другого - ${sum(receiversLeft)}, т.к. именно столько груза в сумме не было вывезено/довезено. В результате получим план, который называется искусственным.`);

	repExtendedTable();

	print(`Пропускная способность фиктивных путей неограничена (будем обозначать их как бесконечность символом ${inf}.).
		Халявы, однако, не будет - <font color="blue">стоимость</font> провоза по таким безграничным путям тоже равна бесконечности, за исключением пути между
		фиктивным поставщиком и потребителем - здесь она ничего не стоит (0).`);

	print(`Если вы еще не поняли, то бесконечная <font color="blue">стоимость</font> перевозки объясняется тем, что из реального мира попасть в <del>2D</del> фиктивный нельзя.
		А вот фиктивный ПО к фиктивному ПН может пройти забесплатно.`)

	print(`Поскольку мы не можем предоставить нашему начальству (вы понимаете, о ком я?) план, включающий в себя мистические создания, нужно исправить его при помощи метода потенциалов.
		Суть вот в чем: эта хитрая штука будет ловко перекидывать грузы от фиктивных поставщиков и получателей реальным.
		При этом он будет стремиться распределить как можно больше груза на путях с наименьшей <font color="blue">стоимостью</font>. А поскольку у мистических-фиктивных ПО/ПН <font color="blue">стоимость</font> бесконечна,
		от них он очень скоро избавится, и в результате еще спустя несколько итераций мы получим наш оптимальный план. Этакая магия вне... политеха.`);
}

function reportResultInitPlan(visitedCount, targetCount) {
	if(visitedCount < targetCount)
		print('Построение плана завершено, поскольку дальше двигаться некуда.');
	else
		print(`Построение плана завершено, поскольку мы посетили все ${targetCount} ячеек.`);
}

var initPlanCounter = 1;

function reportSwitch(row, idx) {
	print(`Лимит ${row ? 'строки' : 'столбца'} ${idx + 1} закончился (${row ? 'ПО' : 'ПН'} №${idx + 1} ${row ? 'отправил весь груз' : 'больше не принимает груз'}). Поэтому идем по ${row ? 'столбцу' : 'строке'}.`);
}

function reportNowhere(row, idx) {
	print(`Клетки ${row ? 'строки' : 'столбца'} ${idx + 1} нам больше не подходят. Поэтому идем по ${row ? 'столбцу' : 'строке'}.`);	
}

function reportSwitchPlan(row, idx, dir) {
	print(`${initPlanCounter++}) Двигаемся ${row ? (dir ? 'вправо' : 'влево') : (dir ? 'вниз' : 'вверх')} по ${row ? 'строке' : 'столбцу'} ${idx + 1}:`);
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

	reportFillCell(i - 1, j - 1, true);
}

const comboReceivers = () => receivers.map((val, idx) => `${val} (${receiversLeft[idx]})`);
const comboSenders = () => senders.map((val, idx) => `${val} (${sendersLeft[idx]})`);

function reportFillCell(i, j, useBrackets = false) {
	const r = useBrackets ? comboReceivers() : receivers;
	const s = useBrackets ? comboSenders() : senders;

	print(createTable(transports, limits, costs, r, s, [{i, j}]));
}

function reportExplainColumnOrRow(row, rowI, rowJ, rowValue, colI, colJ, colValue) {

	print(`Окей, теперь выберем, куда будем двигаться при построении плана: по строке или столбцу?
		Для этого давайте поищем в таблице <font color="blue">стоимостей</font> в столбце ${colJ + 1} и строке ${rowI + 1} другие самые дешевые пути.`);

	print(createTable(transports, limits, costs, comboReceivers(), comboSenders(), [{i:rowI, j:rowJ}, {i:colI, j:colJ}]));

	print(`Как вы можете видеть, в столбце самый дешевый путь стоит ${colValue}, а в строке - ${rowValue}. Мы должны пытаться отправить как можно больше груза по дешевыми путям,
		поэтому двигаемся по ${row ? 'строке' : 'столбцу'}.`);

	print(`Правила движения:<ol>
		<li>выбрать для текущей клетки ее столбец или строку, смотря где есть путь подешевле;</li>
		<li>двигаться по этой строке/столбцу, пока все клетки не будут заполнены или не исчерпается лимит ПО или ПН <del>(нужно построить больше пилонов!)</del>. <b>Пока этого не произойдет,
		свернуть со строки на столбец (или наоборот) мы не можем</b>;</li>
		<li>перейти к пункту 1.</li>
		</ol>`);

	print(`<i>Далее приведено подробное описание построения первоначального плана.
		Конкретно его Гольдштейн подробно расписывать, вроде бы, не требует, поэтому можете переписать только конечный результат.</i>`);

	print('<i>Но все равно, ознакомьтесь с алгоритмом, ведь ваша главная задача - понять, откуда берется каждая из цифр.</i>')

	enableBuffered();
	print('<details><summary>Построение первоначального плана (развернуть)</summary>');
}

function reportMinPlan1(i, j) {

	const a = sendersLeft[i];
	const b = receiversLeft[j];
	const c = limits[i][j];
	const minTrans = Math.min(a, b, c);

	print('<h1>Этап 1: Построение первоначального плана.</h1>')

	print('Прежде всего, мы хотим по максимуму сэкономить на доставке.')

	print('Исходя из этого, мы будем стараться посылать максимум груза по дешевым путям, и минимум - по дорогим.');

	print(`Давайте начнем. Найдем клетку-путь с минимальными <font color="blue">затратами</font> (смотрите на синие цифры в правом верхнем углу). Нам подходит, например, клетка (${i + 1};${j + 1}).`);

	reportFillCell(i, j);

	print(`Как вы можете видеть, перевозка между ПО №${i + 1} до ПН №${j + 1} стоит всего лишь ${costs[i][j]}.
		Теперь нам нужно найти, сколько мы можем максимум перевезти по этому пути.`);

	print(`На перевозку действует три <font color="#854325">ограничения</font>:<ul>
		<li>максимум груза в ПО (как мы видим, это ${a});</li>
		<li>сколько максимум принимает ПН (${b});</li>
		<li><font color="#854325">ограничение</font> <font color="#854325">d<sub>ij</sub></font> пропускной способности пути от ПО до ПН (смотрите на бордовые цифры в левом углу), для нашей клетки это ${c};</li>
		</ul>`)

	print('Понятно, что мы не можем вывезти больше чем есть в ПО, или больше, чем принимает ПН или больше пропускной способности дороги между ними.');

	print(`X<sub>${i + 1}${j + 1}</sub> = min(a<sub>i</sub>; b<sub>j</sub>; <font color="#854325">d<sub>ij</sub></font>) = min(${a};${b};${c}) = ${minTrans}`);

	print(`Внесем это значение в наш план перевозок:`);
}

function reportMinPlan2(i, j, firstFill) {
	reportFillCell(i, j, true);

	print(`<b>Заметьте</b>, что мы вычитаем полученное значение из лимита ПО и ПН, поскольку, по факту, мы доставили этот груз.
		Оставшийся лимит ПО №${i + 1} составит ${sendersLeft[i] + firstFill} - ${firstFill} = ${sendersLeft[i]},
		а для ПН №${j + 1} ${receiversLeft[j] + firstFill} - ${firstFill} = ${receiversLeft[j]}. В скобках мы будем приводить нереализованный на данный момент лимит.`);
}

function reportFucked(howMuch) {
	print(`Не могу подобрать место для ${howMuch} базисных переменных.`);
	print(`Похоже, эта ошибка все таки произошла.
		Пришлите нам на goldislove@mail.ru письмо с темой "ТД калькулятор -
		не хватает места для ${howMuch} базисных переменных" и пришлите входные данные. Постараемся пофиксить и дадим вам знать:)`);
}

function rp1(transportData, basisMatrix) {
	var idxes = []
	for(var i = 0; i < basisMatrix.length; i++)
		for(var j = 0; j < basisMatrix[i].length; j++)
			if(basisMatrix[i][j])
				idxes.push({i, j});

	var s = sum(receiversLeft);

	print(createTable(transportData, customLimits, infCosts, [...receivers, s], [...senders, s], idxes));	
}