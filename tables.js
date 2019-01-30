function createTable(data, dataTopLeft, dataTopRight, colHeaders, rowHeaders, colors, meta=['a<sub>i</sub>', 'b<sub>j</sub>']) {
  let table = '<table>'

  if (colHeaders && colHeaders.length > 0) {
    table += '<tr>'
    if (rowHeaders && rowHeaders[0]) {
      table += `<th class="diagonal"><span class="inf">${meta[0]}</span><span class="sup">${meta[1]}</span></th>`
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
      if (colors) {
        colors.forEach(color => {
          if (color.i == idx && color.j == idxJ) {
            if(!color.g)
              colored = "colored";
            else
              colored = 'paint-' + color.g;
          }
        })
      }

      let topLeft = '';
      let topRight = '';
      let dtl, dtr;
      if (dataTopLeft && dataTopLeft[idx] && dataTopLeft[idx][idxJ]) {
        dtl = dataTopLeft[idx][idxJ]
        topLeft = `<div class="top-left">${dtl}</div>`;
      }
      if (dataTopRight && dataTopRight[idx] && dataTopRight[idx][idxJ]) {
        dtr = dataTopRight[idx][idxJ]
        topRight = `<div class="top-right">${dtr}</div>`;
      }

      let centered = ""
      if (!dtl && !dtr) {
        centered = "centered"
      }

      table += `<td class="${colored} ${centered}">${el}${topLeft}${topRight}</td>`;
    })
    table += '</tr>'
  });

  table += '</table>'
  return table;
}