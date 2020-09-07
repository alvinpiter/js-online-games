class Sudoku {
  constructor(puzzleString, solutionString) {
    this.puzzle = parse(puzzleString)
    this.solution = parse(solutionString)
  }

  assign(row, column, value) {
    if (row === undefined || column === undefined)
      throw new Error('Invalid row or column')

    row = parseInt(row)
    column = parseInt(column)
    value = parseInt(value)

    if (row < 0 || row >= 9 || column < 0 || column >= 9)
      throw new Error('Invalid row or column')

    if (this.puzzle[row][column] !== null)
      throw new Error('Cell is not empty')

    if (this.solution[row][column] !== value)
      throw new Error('Wrong')

    this.puzzle[row][column] = value

    return this.puzzle
  }

  hasEnded() {
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (this.puzzle[row][column] === null)
          return false
      }
    }

    return true
  }
}

//parse a sudoku string into a 2D array
function parse(str) {
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

module.exports = Sudoku
