const ReversiManager = require('./ReversiManager')
const {
  RoomIsNotFullError,
  GameHasNotStartedError,
  CellIsNotEmptyError
} = require('./Errors')
const Reversi = require('./Reversi')

const users = [
  { socketID: 1, nickname: 'alvin', color: 'RED' },
  { socketID: 2, nickname: 'teddy', color: 'BLUE' }
]

const startingBoard = [
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null,  'W',  'B', null, null, null],
  [null, null, null,  'B',  'W', null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null]
]

const board = [
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null,  'W',  'W',  'W', null, null],
  [null, null, null,  'B',  'W', null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null]
]

test('startGame when room is not full yet', () => {
  const manager = new ReversiManager()

  expect(() => manager.startGame(users[0], [users[0]])).toThrowError(RoomIsNotFullError)
})

test('startGame success', () => {
  const manager = new ReversiManager()

  const result = manager.startGame(users[0], users)
  for (let r of result) {
    const user = r.user
    const payload = r.payload

    if (user.socketID === 1) {
      expect(payload).toEqual({
        currentPlayer: 'W',
        player: 'W',
        board: startingBoard
      })
    }

    if (user.socketID === 2) {
      expect(payload).toEqual({
        currentPlayer: 'W',
        player: 'B',
        board: startingBoard
      })
    }
  }

  expect(manager.isPlaying()).toEqual(true)
})

test('move when game has not started yet', () => {
  const manager = new ReversiManager()

  expect(() => manager.move(users[0], {row: 0, column: 0})).toThrowError(GameHasNotStartedError)
})

test('move when game throw an error', () => {
  const manager = new ReversiManager()

  manager.startGame(users[0], users)

  const mockMove = jest.fn()
  mockMove.mockImplementation(() => {
    throw new CellIsNotEmptyError()
  })
  Reversi.prototype.move = mockMove

  expect(() => manager.move(users[0], {row: 0, column: 0})).toThrowError(CellIsNotEmptyError)
})

test('move success and game has not ended', () => {
  const manager = new ReversiManager()

  manager.startGame(users[0], users)

  const mockMove = jest.fn()
  mockMove.mockReturnValue(board)
  Reversi.prototype.move = mockMove

  const mockHasEnded = jest.fn()
  mockHasEnded.mockReturnValue(false)
  Reversi.prototype.hasEnded = mockHasEnded

  const mockGetScore = jest.fn()
  mockGetScore.mockReturnValue({ 'W': 4, 'B': 1 })
  Reversi.prototype.getScore = mockGetScore

  const mockGetCurrentPlayer = jest.fn()
  mockGetCurrentPlayer.mockReturnValue('B')
  Reversi.prototype.getCurrentPlayer = mockGetCurrentPlayer

  expect(manager.move(users[0], {row: 3, column: 5})).toEqual({
    board: board,
    currentPlayer: 'B',
    scores: [
      {
        user: users[0],
        score: 4
      },
      {
        user: users[1],
        score: 1
      }
    ]
  })
})

test('move success and game has ended', () => {
  const manager = new ReversiManager()

  manager.startGame(users[0], users)

  const mockMove = jest.fn()
  mockMove.mockReturnValue(board)
  Reversi.prototype.move = mockMove

  const mockHasEnded = jest.fn()
  mockHasEnded.mockReturnValue(true)
  Reversi.prototype.hasEnded = mockHasEnded

  const mockGetScore = jest.fn()
  mockGetScore.mockReturnValue({ 'W': 4, 'B': 1 })
  Reversi.prototype.getScore = mockGetScore

  const mockGetCurrentPlayer = jest.fn()
  mockGetCurrentPlayer.mockReturnValue('B')
  Reversi.prototype.getCurrentPlayer = mockGetCurrentPlayer

  const mockGetWinner = jest.fn()
  mockGetWinner.mockReturnValue('W')
  Reversi.prototype.getWinner = mockGetWinner

  expect(manager.move(users[0], {row: 3, column: 5})).toEqual({
    board: board,
    currentPlayer: 'B',
    scores: [
      {
        user: users[0],
        score: 4
      },
      {
        user: users[1],
        score: 1
      }
    ],
    gameOverInfo: {
      winner: 'W'
    }
  })
})
