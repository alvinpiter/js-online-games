const SudokuManager = require('./SudokuManager')
const parseSudoku = require('./utils')
const Sudoku = require('./Sudoku')
const puzzleString = '004300209005009001070060043006002087190007400050083000600000105003508690042910300'
const solutionString = '864371259325849761971265843436192587198657432257483916689734125713528694542916378'

const users = [
  { socketID: 1, nickname: 'alvin', color: 'RED' },
  { socketID: 2, nickname: 'teddy', color: 'BLUE' }
]

test('startGame', () => {
  const manager = new SudokuManager()

  const result = manager.startGame(users[0], users)

  expect(result.length).toEqual(2)
  expect(result[0].payload.scores.length).toEqual(2)
  expect(result[1].payload.scores.length).toEqual(2)

  expect(manager.userBlockedCells.size).toEqual(2)
  expect(manager.userScores.size).toEqual(2)

  for (let user of users) {
    expect(manager.userDetails.get(user.socketID)).toEqual(user)

    const blockedCells = manager.userBlockedCells.get(user.socketID)

    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        expect(blockedCells[row][column]).toEqual(false)
      }
    }

    const score = manager.userScores.get(user.socketID)
    expect(score).toEqual(0)
  }

  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++)
      expect(manager.cellColors[row][column]).toEqual(null)
  }
})

test('move with invalid row/column', () => {
  const manager = new SudokuManager()

  const mockAssign = jest.fn()
  mockAssign.mockImplementation(() => {
    throw new Error('Invalid row or column')
  })
  Sudoku.prototype.assign = mockAssign

  manager.startGame(users[0], users)

  expect(() => manager.move(users[0], { row: 0, column: -1, value: 1 })).toThrow('Invalid row or column')
  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      expect(manager.userBlockedCells.get(users[0].socketID)[row][column]).toEqual(false)
      expect(manager.userBlockedCells.get(users[1].socketID)[row][column]).toEqual(false)
    }
  }

  for (let user of users) {
    expect(manager.userScores.get(user.socketID)).toEqual(0)
  }
})

test('move where given number mismatch with the solution', () => {
})

test('move success but game is not over yet', () => {
  const manager = new SudokuManager()

  const board = parseSudoku(puzzleString)

  const mockAssign = jest.fn()
  mockAssign.mockReturnValue(board)
  Sudoku.prototype.assign = mockAssign

  const mockHasEnded = jest.fn()
  mockHasEnded.mockReturnValue(false)
  Sudoku.prototype.hasEnded = mockHasEnded

  manager.startGame(users[0], users)
  const result = manager.move(users[1], { row: 0, column: 0, value: 8 })

  expect(result.board).toEqual(board)
  expect(result.cellColors[0][0]).toEqual(users[1].color)
  expect(result.scores).toEqual([
    { user: users[1], score: 1 },
    { user: users[0], score: 0 }
  ])
  expect(result.gameOver).toEqual(false)
})

test('move success and game is over', () => {
  const manager = new SudokuManager()

  const board = parseSudoku(solutionString)

  const mockAssign = jest.fn()
  mockAssign.mockReturnValue(board)
  Sudoku.prototype.assign = mockAssign

  const mockHasEnded = jest.fn()
  mockHasEnded.mockReturnValue(true)
  Sudoku.prototype.hasEnded = mockHasEnded

  manager.startGame(users[0], users)
  const result = manager.move(users[1], { row: 0, column: 0, value: 8 })

  expect(result.board).toEqual(board)
  expect(result.cellColors[0][0]).toEqual(users[1].color)
  expect(result.scores).toEqual([
    { user: users[1], score: 1 },
    { user: users[0], score: 0 }
  ])
  expect(result.gameOver).toEqual(true)
})
