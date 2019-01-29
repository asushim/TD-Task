const BIGGEST_VALUE = Number.MAX_SAFE_INTEGER;

var useBuffer = false;

var bufferResult = "";

Array.prototype.column = function(colIdx) { return this.map(c => c[colIdx]) }

function sum(arr)
{
	return arr.reduce((a, b) => a + b);
}

function print(text)
{
	const txt = "<p>" + text + "</p>";

	if(useBuffer)
		bufferResult += txt;
	else
		document.body.innerHTML += txt;
}

function enableBuffered() {
	useBuffer = true;
}

function flushBuffer() {
	useBuffer = false;
	print(bufferResult);
	bufferResult = "";
}