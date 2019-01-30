function reportBasis1(transportData, basisMatrix) {
	print('<h1>Этап 2: Метод потенциалов.</h1>');
	print('<h3>Шаг 1: Выбор базисных переменных.</h3>');
	print('Прежде всего, выберем так называемые "базисные переменные".')
	print('Сперва выбираем в нашем плане все клетки, значение которых больше нуля, но меньше <font color="#854325">ограничения</font> <font color="#854325">d<sub>ij</sub></font>.');

	print(`Почему именно их? Дело в том, что мы не можем перевести груза меньше чем 0 или больше чем <font color="#854325">ограничение</font> пути.
		Поэтому такие клетки мы игнорируем. А вот для выбранных клеток метод потенциалов сможет как добавлять, так и вычитать единицы груза.`);

	rp1(transportData, basisMatrix);
}

function reportBasis2(transportData, basisMatrix, newCells, needed, target) {
	const str = newCells.map(el => `(${el.i + 1};${el.j + 1})`).join(', ');
	print(`Однако кол-во базисных клеток должно быть равно кол-ву ПО (включая фиктивного) + кол-во ПН - 1 = ${target} (почему так решено - не имею понятия).
		Нам не хватает еще ${needed}. Для этого среди оставшихся придется найти клетки, которые не образуют с базисными <b>цикл пересчета</b>.`)

	print(`<details><summary>Что такое цикл пересчета?</summary>
		<p>Цикл пересчета - <a href='https://youtu.be/A-MhUnIByp0' target="_blank">геометрическое представление разложения небазисного вектора условий при переменной
		в свободной клетке по векторам текущего базиса.</a></p>
		Если говорить чуть проще, то суть вот в чем: вы выбираете клетку, которую хотите сделать базисной. Затем вы двигаетесь из нее по вертикали или горизонтали.
		Когда вы доходите до какой-нибудь базисной клетки, вы можете двигаться в том же направлении, а можете повернуть на 90 градусов (влево или вправо) и продолжить движение.
		Делать повороты можно только в базисных клетках (т.е. они являются узлами цикла). На 180 разворачиваться нельзя никогда! Если в итоге вы каким-то образом вернулись туда,
		откуда пришли - поздравляю, вы построили этот самый цикл. Однако, как уже было сказано, базисные переменные не должны его образовывать, поэтому выбранная клетка-кандидат
		проходит мимо.
		<p><a href='https://helpiks.org/helpiksorg/baza7/170642055149.files/image154.jpg' target="_blank">Вот здесь</a> картинка с примерами такого цикла.</p>
		</details>`);

	print(`В качестве таких клеток нам подходят: ${str}`);

	rp1(transportData, basisMatrix);
}

function reportPotentials(uArray, vArray, basisArray) {
	print('<h3>Шаг 2: Вычисление потенциалов.</h3>');
	print(`Ладно, с базисными клетками мы разобрались. Теперь нам нужно найти потенциалы всех пунктов,
		которые обозначаются как U<sub>i</sub> для отправителей, и V<sub>j</sub> - для получателей. Не вздумайте перепутать!`);
	print('Необходимо, чтобы для базисных клеток выполнялось вот такое вот равенство:');
	print('<b>V<sub>j</sub> - U<sub>i</sub> = c<sub>ij</sub></b>');

	print('Составим систему уравнений и по цепочке найдем все потенциалы, полагая, что U<sub>1</sub> = 0.');

	var split1;
	var split2;

	if(basisArray.length > 8) {
		split1 = basisArray.slice(0, basisArray.length / 2);
		split2 = basisArray.slice(basisArray.length / 2, basisArray.length);
	} else {
		split1 = basisArray;
	}

	const s = sum(receiversLeft);
	const customData = [...transports.map((row, idx) => [...row, sendersLeft[idx], uArray[idx]]), [...receiversLeft, 0, uArray[uArray.length - 1]], vArray];

	var str = '<div style="display: inline-block;">' + 
		createTable(customData, customLimits, infCosts, [...receivers, s, 'U<sub>i</sub>'], [...senders, s, 'V<sub>j</sub>'], basisArray) +
		'</div><div style="display: inline-block; margin-left: 30px; vertical-align:top;"><p>' +
		split1.map(el => `<b>V<sub>${el.j + 1}</sub> - U<sub>${el.i + 1}</sub> = ${infCosts[el.i][el.j]}`).join('</p><p>') + 
		'</p></div>';

	if(split2)
		str += '<div style="display: inline-block; margin-left: 30px; vertical-align:top;"><p>' +
		split2.map(el => `<b>V<sub>${el.j + 1}</sub> - U<sub>${el.i + 1}</sub> = ${infCosts[el.i][el.j]}`).join('</p><p>') + 
		'</p></div>';

	print(str);

	print(`Можете убедиться в правильности расчетов: пикните какую-нибудь <font color="red">базисную</font> клетку, выберите V из нижней строчки, и U из правого столбика,
		вычтите V - U, и это будет равно <font color="blue">стоимости</font> для этой клетки.`)
}