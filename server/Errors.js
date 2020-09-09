class OutOfBoundsError extends Error {
  constructor(data) {
    super('Row or column is out of bounds')
    this.name = 'OutOfBoundsError'
    this.data = data
  }
}

class CellIsNotEmptyError extends Error {
  constructor(data) {
    super('Cell is not empty')
    this.name = 'CellIsNotEmptyError'
    this.data = data
  }
}

class SudokuCellMismatchError extends Error {
  constructor(data) {
    super('Mismatch with solution')
    this.name = 'SudokuCellMismatchError'
    this.data = data
  }
}

module.exports = {
  OutOfBoundsError,
  CellIsNotEmptyError,
  SudokuCellMismatchError
}
