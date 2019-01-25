const BIGGEST_VALUE = Number.MAX_SAFE_INTEGER;

Array.prototype.column = function(colIdx) { return this.map(c => c[colIdx]) }

function sum(arr)
{
	return arr.reduce((a, b) => a + b);
}

function print(text)
{
	document.write(text);
}

function println(text)
{
	document.write("<p>" + text + "</p>")
}

function printTable(tableData, columns, rows, col2, rows2) {
  var table = document.createElement('table');

  var header = table.createTHead();

  var row = header.insertRow();
  var row2 = header.insertRow();

  row.insertCell();

  if(col2 && rows2) {
  row.insertCell().innerHTML = 'ПН';
  row2.insertCell().innerHTML = 'ПО';

  row2.insertCell().innerHTML = 'Осталось';

  col2.forEach(col => {var cell = row2.insertCell(); cell.innerHTML = `<b>${col}</b>`});
  }

  columns.forEach(col => {var cell = row.insertCell(); cell.innerHTML = `<b>${col}</b>`});
  

  table.setAttribute('border', 10);
  var tableBody = document.createElement('tbody');

  var i = 0;
  tableData.forEach(function(rowData) {
    var row = document.createElement('tr');

    var cell = row.insertCell();

    cell.innerHTML = `<b>${rows[i]}</b>`;

    if(rows2) {
    cell = row.insertCell();
    cell.innerHTML = `<b>${rows2[i]}</b>`;
  }

    rowData.forEach(function(cellData) {
      var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
    i++;
  });

  table.appendChild(tableBody);
  document.body.appendChild(table);
}