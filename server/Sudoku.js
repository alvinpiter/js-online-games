const parseSudoku = require('./utils')
const {
  OutOfBoundsError,
  CellIsNotEmptyError,
  SudokuCellMismatchError
} = require('./Errors')

class Sudoku {
  constructor(puzzleString, solutionString) {
    this.board = parseSudoku(puzzleString)
    this.solution = parseSudoku(solutionString)
  }

  getBoard() {
    return this.board
  }

  assign(row, column, value) {
    if (row === undefined || column === undefined)
      throw new OutOfBoundsError()

    row = parseInt(row)
    column = parseInt(column)
    value = parseInt(value)

    if (row < 0 || row >= 9 || column < 0 || column >= 9)
      throw new OutOfBoundsError()

    if (this.board[row][column] !== null)
      throw new CellIsNotEmptyError()

    if (this.solution[row][column] !== value)
      throw new SudokuCellMismatchError()

    this.board[row][column] = value

    return this.board
  }

  hasEnded() {
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (this.board[row][column] === null)
          return false
      }
    }

    return true
  }
}

module.exports = Sudoku
