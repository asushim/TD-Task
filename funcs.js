const BIGGEST_VALUE = Number.MAX_SAFE_INTEGER;

Array.prototype.column = function(colIdx) { return this.map(c => c[colIdx]) }

function sum(arr)
{
	return arr.reduce((a, b) => a + b);
}

function print(text)
{
	document.body.innerHTML += text;
}

function println(text)
{
	document.body.innerHTML += "<p>" + text + "</p>";
}