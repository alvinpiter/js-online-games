const Sudoku = require('./Sudoku')
const {
  OutOfBoundsError,
  CellIsNotEmptyError,
  SudokuCellMismatchError
} = require('./Errors')

const puzzle = [
  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const solution = [
  [3, 8, 4, 7, 5, 2, 1, 9, 6],
  [7, 2, 8, 9, 1, 4, 6, 5, 3],
  [6, 7, 5, 8, 3, 9, 4, 1, 2],
  [4, 5, 7, 3, 8, 1, 2, 6, 9],
  [5, 9, 3, 1, 6, 8, 7, 2, 4],
  [2, 3, 6, 5, 9, 7, 8, 4, 1],
  [8, 6, 1, 2, 4, 5, 9, 3, 7],
  [9, 1, 2, 4, 7, 6, 3, 8, 5],
  [1, 4, 9, 6, 2, 3, 5, 7, 8]
]

test('assign to non-empty cell', () => {
  const sudoku = new Sudoku(puzzle, solution)

  expect(() => sudoku.assign(0, 0, 1)).toThrowError(CellIsNotEmptyError)
})

test('assign to invalid row or column', () => {
  const sudoku = new Sudoku(puzzle, solution)

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
  const sudoku = new Sudoku(puzzle, solution)

  expect(() => sudoku.assign(0, 1, 3)).toThrowError(SudokuCellMismatchError)
})

test('hasEnded', () => {
  const testCases = [ puzzle, solution ]
  const expectations = [ false, true ]

  for (let i = 0; i < testCases.length; i++) {
    const sudoku = new Sudoku(testCases[i], solution)
    expect(sudoku.hasEnded()).toEqual(expectations[i])
  }
})
