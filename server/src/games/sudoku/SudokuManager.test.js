const SudokuManager = require('./SudokuManager')
const Sudoku = require('./Sudoku')
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
const {
  CellIsBlockedError, SudokuCellMismatchError, GameHasNotStartedError
} = require('../../errors')

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

  expect(manager.isPlaying()).toEqual(true)
})

test('move when game has not started', () => {
  const manager = new SudokuManager()

  expect(() => manager.move(users[0], {row: 0, column: 0, value: 1})).toThrowError(GameHasNotStartedError)
})

test('move when game throws an error', () => {
  const manager = new SudokuManager()

  const mockAssign = jest.fn()
  mockAssign.mockImplementation(() => {
    throw new Error('Some error')
  })
  Sudoku.prototype.assign = mockAssign

  manager.startGame(users[0], users)

  expect(() => manager.move(users[0], { row: 0, column: 0, value: 1 })).toThrow('Some error')
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

test('move when game throws SudokuCellMismatchError', () => {
  const manager = new SudokuManager()

  const mockAssign = jest.fn()
  mockAssign.mockImplementation(() => {
    throw new SudokuCellMismatchError
  })
  Sudoku.prototype.assign = mockAssign

  manager.startGame(users[0], users)

  expect(() => manager.move(users[0], {row: 0, column: 0, value: 1})).toThrow(SudokuCellMismatchError)
  expect(() => manager.move(users[0], {row: 0, column: 0, value: 1})).toThrow(CellIsBlockedError)
})

test('move on blocked cell', () => {
  const manager = new SudokuManager()

  manager.startGame(users[0], users)
  manager.blockCell(users[0], 0, 0)

  expect(() => manager.move(users[0], {row: 0, column: 0, value: 1})).toThrowError(CellIsBlockedError)
})

test('move success but game is not over yet', () => {
  const manager = new SudokuManager()

  const mockAssign = jest.fn()
  mockAssign.mockReturnValue(solution)
  Sudoku.prototype.assign = mockAssign

  const mockHasEnded = jest.fn()
  mockHasEnded.mockReturnValue(false)
  Sudoku.prototype.hasEnded = mockHasEnded

  manager.startGame(users[0], users)
  const result = manager.move(users[1], { row: 0, column: 0, value: 8 })

  expect(result.board).toEqual(solution)
  expect(result.cellColors[0][0]).toEqual(users[1].color)
  expect(result.scores).toEqual([
    { user: users[1], score: 1 },
    { user: users[0], score: 0 }
  ])
  expect(result.gameOver).toEqual(false)
})

test('move success and game is over', () => {
  const manager = new SudokuManager()

  const mockAssign = jest.fn()
  mockAssign.mockReturnValue(solution)
  Sudoku.prototype.assign = mockAssign

  const mockHasEnded = jest.fn()
  mockHasEnded.mockReturnValue(true)
  Sudoku.prototype.hasEnded = mockHasEnded

  manager.startGame(users[0], users)
  const result = manager.move(users[1], { row: 0, column: 0, value: 8 })

  expect(result.board).toEqual(solution)
  expect(result.cellColors[0][0]).toEqual(users[1].color)
  expect(result.scores).toEqual([
    { user: users[1], score: 1 },
    { user: users[0], score: 0 }
  ])
  expect(result.gameOver).toEqual(true)
})

test('resign', () => {
  const manager = new SudokuManager()

  manager.startGame(users[0], users)
  expect(manager.resign(users[0])).toEqual({resigner: users[0]})
  expect(manager.isPlaying()).toEqual(false)
})
