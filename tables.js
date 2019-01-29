function createTable(data, colHeaders, rowHeaders, colors, meta="") {
  let table = '<table>'

  if (colHeaders && colHeaders.length > 0) {
    table += '<tr>'
    if (rowHeaders && rowHeaders[0]) {
      table += `<th>${meta}</td>`;
    }
    colHeaders.forEach(header => {
      table += '<th>' + header + '</th>';
    })
    table += '</tr>'
  }

  data.forEach((row, idx) => {
    table += '<tr>'
    if (rowHeaders && rowHeaders[idx]) {
      table += '<th>' + rowHeaders[idx] + '</td>';
    }
    row.forEach((el, idxJ) => {
      let colored = ""
      if(colors)
      colors.forEach(color => {
        if (color.i == idx && color.j == idxJ) {
          colored = "colored"
        }
      })
      table += `<td class="${colored}">` + el + '</td>';
    })
    table += '</tr>'
  });

  table += '</table>'
  return table;
}