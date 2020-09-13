const TicTacToeManager = require('./TicTacToeManager.js')
const { GameHasNotStartedError, RoomIsNotFullError } = require('./Errors.js')
const TicTacToe = require('./TicTacToe.js')

const users = [
  { socketID: 1, nickname: 'alvin', color: 'RED' },
  { socketID: 2, nickname: 'teddy', color: 'BLUE' }
]

const startingBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]

test('startGame when room is not full yet', () => {
  const manager = new TicTacToeManager()

  expect(() => manager.startGame(users[0], [users[0]])).toThrowError(RoomIsNotFullError)
})

test('startGame success', () => {
  const manager = new TicTacToeManager()

  const mockGetBoard = jest.fn()
  mockGetBoard.mockReturnValue(startingBoard)
  TicTacToe.prototype.getBoard = mockGetBoard

  const mockGetCurrentPlayer = jest.fn()
  mockGetCurrentPlayer.mockReturnValue('X')
  TicTacToe.prototype.getCurrentPlayer = mockGetCurrentPlayer

  const result = manager.startGame(users[0], users)
  for (let r of result) {
    const { user, payload } = r

    expect(payload.currentPlayer).toEqual('X')
    expect(payload.board).toEqual(startingBoard)

    if (user.socketID === users[0].socketID)
      expect(payload.player).toEqual('X')

    if (user.socketID === users[1].socketID)
      expect(payload.player).toEqual('O')
  }

  expect(manager.isPlaying()).toEqual(true)
})

test('move when game has not started yet', () => {
  const manager = new TicTacToeManager()

  expect(() => manager.move(users[0], {row: 0, column: 0})).toThrowError(GameHasNotStartedError)
})

test('move when game throw an error', () => {
  const manager = new TicTacToeManager()

  manager.startGame(users[0], users)

  const mockMove = jest.fn()
  mockMove.mockImplementation(() => {
    throw new Error('Some error')
  })
  TicTacToe.prototype.move = mockMove

  expect(() => manager.move(users[0], {row: 0, column: 0})).toThrow('Some error')
})

test('move success and game has not ended', () => {
  const manager = new TicTacToeManager()

  manager.startGame(users[0], users)

  const newBoard = [
    ['X', null, null],
    [null, null, null],
    [null, null, null]
  ]

  const mockMove = jest.fn()
  mockMove.mockReturnValue(newBoard)
  TicTacToe.prototype.move = mockMove

  const mockHasEnded = jest.fn()
  mockHasEnded.mockReturnValue(false)
  TicTacToe.prototype.hasEnded = mockHasEnded

  const mockGetCurrentPlayer = jest.fn()
  mockGetCurrentPlayer.mockReturnValue('O')
  TicTacToe.prototype.getCurrentPlayer = mockGetCurrentPlayer

  const result = manager.move(1, {row: 0, column: 0})

  expect(result).toEqual({
    currentPlayer: 'O',
    board: newBoard
  })
})

test('move success and game has ended', () => {
  const manager = new TicTacToeManager()

  manager.startGame(users[0], users)

  const newBoard = [
    ['X', null, null],
    [null, null, null],
    [null, null, null]
  ]

  const mockMove = jest.fn()
  mockMove.mockReturnValue(newBoard)
  TicTacToe.prototype.move = mockMove

  const mockHasEnded = jest.fn()
  mockHasEnded.mockReturnValue(true)
  TicTacToe.prototype.hasEnded = mockHasEnded

  const mockGetCurrentPlayer = jest.fn()
  mockGetCurrentPlayer.mockReturnValue('O')
  TicTacToe.prototype.getCurrentPlayer = mockGetCurrentPlayer

  const mockGetWinner = jest.fn()
  mockGetWinner.mockReturnValue('X')
  TicTacToe.prototype.getWinner = mockGetWinner

  const result = manager.move(1, {row: 0, column: 0})

  expect(result).toEqual({
    currentPlayer: 'O',
    board: newBoard,
    gameOverInfo: { winner: 'X' }
  })

  expect(manager.isPlaying()).toEqual(false)
})

test('resign', () => {
  const manager = new TicTacToeManager()

  manager.startGame(users[0], users)
  expect(manager.resign(users[0])).toEqual({resigner: users[0]})
  expect(manager.isPlaying()).toEqual(false)
})
