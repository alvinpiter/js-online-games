//parse a sudoku string into a 2D array
function parseSudoku(str) {
  let result = []
  let row = []
  for (let idx = 0; idx < 81; idx++) {
    let num = (str[idx] === '0' ? null : parseInt(str[idx]))

    row.push(num)
    if (row.length === 9) {
      result.push(row)
      row = []
    }
  }

  return result
}

module.exports = parseSudoku
