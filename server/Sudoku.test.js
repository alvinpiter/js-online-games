const Sudoku = require('./Sudoku')
const {
  OutOfBoundsError,
  CellIsNotEmptyError,
  SudokuCellMismatchError
} = require('./Errors')
const puzzleString = '004300209005009001070060043006002087190007400050083000600000105003508690042910300'
const solutionString = '864371259325849761971265843436192587198657432257483916689734125713528694542916378'

test('assign to non-empty cell', () => {
  const sudoku = new Sudoku(puzzleString, solutionString)

  expect(() => sudoku.assign(0, 2, 1)).toThrowError(CellIsNotEmptyError)
})

test('assign to invalid row or column', () => {
  const sudoku = new Sudoku(puzzleString, solutionString)

  const invalids = [
    [undefined, 0, 1],
    [0, undefined, 1],
    [-1, 0, 1],
    [9, 0, 1],
    [0, -1, 1],
    [0, 9, 1]
  ]

  for (let invalid of invalids) {
    expect(() => sudoku.assign(invalid[0], invalid[1], invalid[2])).toThrowError(OutOfBoundsError)
  }
})

test('assign does not match solution', () => {
  const sudoku = new Sudoku(puzzleString, solutionString)

  expect(() => sudoku.assign(0, 0, 1)).toThrowError(SudokuCellMismatchError)
})

test('hasEnded', () => {
  const testCases = [ puzzleString, solutionString ]
  const expectations = [ false, true ]

  for (let i = 0; i < testCases.length; i++) {
    const sudoku = new Sudoku(testCases[i], solutionString)
    expect(sudoku.hasEnded()).toEqual(expectations[i])
  }
})
