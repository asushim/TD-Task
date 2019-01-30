const inf = '<i>m</i>';

const customLimits = [...limits.map((row, idx) => [...row, inf]), new Array(receivers.length + 1).fill(inf)];
const customCosts = [...costs.map((row, idx) => [...row, inf]), [...new Array(receivers.length).fill(inf), '0']];

function reportTable() {
	print(createTable(transports, limits, costs, receivers, senders));
}

function repExtendedTable() {

	const s = sum(receiversLeft);
	const customTransports = [...transports.map((row, idx) => [...row, sendersLeft[idx]]), [...receiversLeft, 0]];
	print(createTable(customTransports, customLimits, customCosts, [...receivers, s], [...senders, s]));
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

	print(`Дабы разрешить эту проблему, добавим одного фиктивного поставщика, который "отвезет" груз нашим обделенным получателям. Еще добавим и фиктивного получателя,
		который "примет" груз от неполностью реализовавших себя поставщиков.
		Лимит и того и другого - ${sum(receiversLeft)}, т.к. именно столько груза в сумме не было вывезено/довезено. В результате получим план, который называется искусственным.`);

	repExtendedTable();

	print(`Пропускная способность фиктивных путей неограничена (будем обозначать их как бесконечность символом ${inf}.).
		Халявы, однако, не будет - стоимость провоза по таким безграничным путям тоже равна бесконечности, за исключением пути между
		фиктивным поставщиком и потребителем - здесь она ничего не стоит (0).`);

	print(`Если вы еще не поняли, то бесконечная стоимость перевозки объясняется тем, что из реального мира попасть в <del>2D</del> фиктивный нельзя.
		А вот фиктивный ПО к фиктивному ПН может пройти забесплатно.`)

	print(`Поскольку мы не можем предоставить нашему начальству (вы понимаете, о ком я?) план, включающий в себя мистические создания, нужно исправить его при помощи метода потенциалов.
		Суть вот в чем: эта хитрая штука будет ловко перекидывать грузы от фиктивных поставщиков и получателей реальным.
		При этом он будет стремиться распределить как можно больше груза на путях с наименьшей стоимостью. А поскольку у мистических-фиктивных ПО/ПН стоимость бесконечна,
		от них он очень скоро избавится, и в результате еще спустя несколько итераций мы получим наш оптимальный план.`);
}

function reportResultInitPlan(visitedCount, targetCount) {
	if(visitedCount < targetCount)
		print('Построение плана завершено, поскольку дальше двигаться некуда.');
	else
		print(`Построение плана завершено, поскольку мы посетили все ${targetCount} ячеек.`);
}

var initPlanCounter = 1;

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
 	createTable(costs, undefined, undefined, receivers, senders) +
 	'</div><div style="display: inline-block; margin-left: 20px;">' +
 	'Ограничения (d<sub>ij</sub>). Максимальное<br>кол-во единиц груза, который можно<br>провезти от<br>ПО<sub>i</sub> до ПН<sub>j</sub>.' +
 	createTable(limits, undefined, undefined, receivers, senders) +
 	'</div>';
}

function reportBalanced(balanced, sum) {
	if(balanced)
		print("Сумма лимита ПО = сумма лимита ПН = " + sum + " => задача сбалансирована (весь груз может быть вывезен, все ПН получат груз полностью).");
	else
		print("Задача не сбалансирована");
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
		Для этого давайте поищем в таблице стоимостей в столбце ${colJ + 1} и строке ${rowI + 1} другие самые дешевые пути.`);

	print(createTable(transports, limits, costs, comboReceivers(), comboSenders(), [{i:rowI, j:rowJ}, {i:colI, j:colJ}]));

	print(`Как вы можете видеть, в столбце самый дешевый путь стоит ${colValue}, а в строке - ${rowValue}. Мы должны пытаться отправить как можно больше груза по дешевыми путям,
		поэтому двигаемся по ${row ? 'строке' : 'столбцу'}.`);

	print(`Правила движения:<ol>
		<li>выбрать для текущей клетки ее столбец или строку, смотря где есть путь подешевле;</li>
		<li>двигаться по этой строке/столбцу, пока все клетки не будут заполнены или не исчерпается лимит ПО или ПН. <b>Пока этого не произойдет,
		свернуть со строки на столбец (или наоборот) мы не можем</b>;</li>
		<li>перейти к пункту 1.</li>
		</ol>`)

	print(`<i>Далее приведено подробное описание построения первоначального плана.
		Гольдштейн - не зверь, и подробно расписывать его с вас, скорее всего, не потребует, поэтому можете переписать только конечный результат</i>`);

	print('<i>Но все равно ознакомьтесь с алгоритмом, ведь ваша главная задача - понять, откуда берется каждая из цифр.</i>')

	enableBuffered();
	print('<details><summary>Построение первоначального плана (развернуть)</summary>');
}

function reportMinPlan1(i, j) {

	const a = sendersLeft[i];
	const b = receiversLeft[j];
	const c = limits[i][j];
	const minTrans = Math.min(a, b, c);

	print('<h1>Этап 1: Построение первоначального плана.</h1>')

	print('Какова наша главная цель? Прежде всего, мы хотим по максимуму сэкономить на доставке. Доставка за единицу груза между определенными ПО и ПН указана в таблице c<sub>ij</sub>.')

	print('Исходя из этого, мы будем стараться посылать максимум груза по дешевым путям, и минимум - по дорогим.');

	print(`Давайте начнем. Найдем клетку-путь с минимальными затратами (смотрите на синие цифры в правом верхнем углу). Нам подходит, например, клетка (${i + 1};${j + 1}).`);

	reportFillCell(i, j);

	print(`Как вы можете видеть, перевозка между ПО №${i + 1} до ПН №${j + 1} стоит всего лишь ${costs[i][j]}.
		Теперь нам нужно найти, сколько мы можем максимум перевезти по этому пути.`);

	print(`На перевозку действует три ограничения:<ul>
		<li>максимум груза в ПО (как мы видим, это ${a});</li>
		<li>сколько максимум принимает ПН (${b});</li>
		<li>ограничение d<sub>ij</sub> пропускной способности пути от ПО до ПН (смотрите на красные цифры в левом углу), для нашей клетки это ${c};</li>
		</ul>`)

	print('Понятно, что мы не можем вывезти больше чем есть в ПО, или больше, чем принимает ПН или больше пропускной способности дороги между ними.')

	print(`X<sub>${i + 1}${j + 1}</sub> = min(a<sub>i</sub>; b<sub>j</sub>; d<sub>ij</sub>) = min(${a};${b};${c}) = ${minTrans}`);

	print(`Внесем это значение в наш план перевозок:`);
}

function reportMinPlan2(i, j, firstFill) {
	reportFillCell(i, j, true);

	print(`<b>Учтите</b>, что мы вычитаем полученное значение из лимита ПО и ПН, поскольку, по факту, мы доставили этот груз.
		Оставшийся лимит ПО №${i + 1} составит ${sendersLeft[i] + firstFill} - ${firstFill} = ${sendersLeft[i]},
		а для ПН №${j + 1} ${receiversLeft[j] + firstFill} - ${firstFill} = ${receiversLeft[j]}. В скобках мы будем приводить нереализованный на данный момент лимит.`)
}

function reportFucked(howMuch) {
	print(`Не могу подобрать место для ${howMuch} базисных переменных.`);
	print(`Похоже, эта ошибка все таки произошла.
		Пришлите нам на goldislove@mail.ru письмо с темой "ТД калькулятор -
		не хватает места для ${howMuch} базисных переменных" и пришлите входные данные. Постараемся пофиксить и дадим вам знать:)`)
}

function rp1(transportData, basisMatrix) {
	var idxes = []
	for(var i = 0; i < basisMatrix.length; i++)
		for(var j = 0; j < basisMatrix[i].length; j++)
			if(basisMatrix[i][j])
				idxes.push({i, j});


	var s = sum(receiversLeft);

	print(createTable(transportData, customLimits, customCosts, [...receivers, s], [...senders, s], idxes));	
}

function reportPotentials1(transportData, basisMatrix) {
	print('<h1>Этап 2: Метод потенциалов.</h1>');
	print('Прежде всего, выберем так называемые "базисные переменные".')
	print('Сперва выбираем в нашем плане все клетки, значение которых больше нуля, но меньше ограничения d<sub>ij</sub>.');

	print(`Почему именно их? Дело в том, что мы не можем перевести груза меньше чем 0 или больше чем ограничение пути.
		Поэтому такие клетки мы игнорируем. А вот для выбранных клеток метод потенциалов сможет как добавлять, так и вычитать единицы груза.`)

	rp1(transportData, basisMatrix);
}

function reportPotentials2(transportData, basisMatrix, newCells, needed, target) {
	const str = newCells.map(el => `(${el.i + 1};${el.j + 1})`).join(', ');
	print(`Однако кол-во базисных клеток должно быть равно кол-ву ПО (включая фиктивного) + кол-во ПН - 1 = ${target} (почему так решено - не имею понятия).
		Нам не хватает еще ${needed}. Для этого среди оставшихся придется-таки найти клетки, которые не образуют с базисными <b>цикл пересчета</b>.`)

	print(`<details><summary>Что такое цикл пересчета?</summary>
		<p>Цикл пересчета - <a href='https://youtu.be/A-MhUnIByp0' target="_blank">геометрическое представление разложения небазисного вектора условий при переменной в свободной клетке по векторам текущего базиса.</a></p>
		Если говорить чуть проще, то суть вот в чем: вы выбираете клетку, которую хотите сделать базисной. Затем вы двигаетесь из нее по вертикали или горизонтали.
		Когда вы доходите до какой-нибудь базисной клетки, вы можете двигаться в том же направлении, а можете повернуть на 90 градусов (влево или вправо) и продолжить движение. Делать повороты можно только
		в базисных клетках (т.е. они являются узлами цикла). На 180 разворачиваться нельзя никогда! Если в итоге вы каким-то образом вернулись туда, откуда пришли - поздравляю,
		вы построили этот самый цикл. Однако, как уже было сказано, базисные переменные не должны его образовывать, поэтому выбранная клетка-кандидат проходит мимо.<p><a href='https://helpiks.org/helpiksorg/baza7/170642055149.files/image154.jpg' target="_blank">Вот здесь</a> картинка с примерами такого цикла.</p>
		</details>`)

	print(`В качестве таких клеток нам подходят: ${str}`);

	rp1(transportData, basisMatrix);
}