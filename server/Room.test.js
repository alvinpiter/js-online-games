const Room = require('./Room')
const TicTacToe = require('./TicTacToe')
const {
  RoomIsFullError,
  NicknameTakenError,
  GameIsOnGoingError
} = require('./Errors')

test('create room with invalid game name', () => {
  expect(() => new Room('PUBG')).toThrow('Invalid game name')
})

test('addUser when nickname already exists', () => {
  const room = new Room('TICTACTOE')

  room.addUser(1, 'alvin')

  expect(() => room.addUser(2, 'alvin')).toThrowError(NicknameTakenError)
})

test('addUser when room is full', () => {
  const room = new Room('TICTACTOE')

  room.addUser(1, 'alvin')
  room.addUser(2, 'teddy')

  expect(() => room.addUser(3, 'smith')).toThrowError(RoomIsFullError)
})

test('addUser when game is on going', () => {
  const room = new Room('SUDOKU')

  room.addUser(1, 'alvin')
  room.startGame(1)

  expect(() => room.addUser(2, 'teddy')).toThrowError(GameIsOnGoingError)
})

test('addUser success', () => {
  const room = new Room('TICTACTOE')

  const user = room.addUser(1, 'alvin')

  expect(user.nickname).toEqual('alvin')
  expect(user.color).not.toEqual(undefined)
  expect(room.getNumberOfUsers()).toEqual(1)
})

test('removeUser when invalid socketID', () => {
  const room = new Room('TICTACTOE')

  expect(() => room.removeUser(1)).toThrow('Invalid socketID')
})

test('removeUser success', () => {
  const room = new Room('TICTACTOE')

  room.addUser(1, 'alvin')

  const user = room.removeUser(1)

  expect(user.nickname).toEqual('alvin')
  expect(user.color).not.toEqual(undefined)
  expect(room.getNumberOfUsers()).toEqual(0)
})

test('addMessage when invalid socketID', () => {
  const room = new Room('TICTACTOE')

  expect(() => room.addMessage(1, 'hehe')).toThrow('Invalid socketID')
})

test('addMessage success', () => {
  const room = new Room('TICTACTOE')

  room.addUser(1, 'alvin')
  room.addUser(2, 'teddy')

  room.addMessage(1, 'from alvin')

  const message = room.addMessage(2, 'from teddy')
  expect(message).toEqual({
    user: { nickname: 'teddy', socketID: 2, color: expect.any(String) },
    text: 'from teddy'
  })

  const messageHistories = room.getMessages()
  expect(messageHistories).toEqual([
    {
      user: { nickname: 'alvin', socketID: 1, color: expect.any(String) },
      text: 'from alvin'
    },
    {
      user: { nickname: 'teddy', socketID: 2, color: expect.any(String) },
      text: 'from teddy'
    }
  ])
})

test('addMessage only maintain last 50 messages', () => {
  const room = new Room('TICTACTOE')

  room.addUser(1, 'alvin')

  for (let i = 0; i < 55; i++)
    room.addMessage(1, 'from alvin')

  expect(room.getMessages().length).toEqual(50)
})

test('startGame when room is not full yet', () => {
  const room = new Room('TICTACTOE')

  room.addUser(1, 'alvin')

  expect(() => room.startGame(1)).toThrow('Room is not full yet')
})

test('startGame success', () => {
  const room = new Room('TICTACTOE')

  room.addUser(1, 'alvin')
  room.addUser(2, 'teddy')

  const result = room.startGame(1)

  expect(result.length).toEqual(2)
  for (let r of result) {
    const user = r.user
    const payload = r.payload

    if (user.socketID === 1) {
      expect(payload).toEqual({
        currentPlayer: 'X',
        player: 'X',
        board: [[null, null, null], [null, null, null], [null, null, null]]
      })
    }

    if (user.socketID === 2) {
      expect(payload).toEqual({
        currentPlayer: 'X',
        player: 'O',
        board: [[null, null, null], [null, null, null], [null, null, null]]
      })
    }
  }

  expect(room.isPlaying()).toEqual(true)
})

test('move when game has not started yet', () => {
  const room = new Room('TICTACTOE')

  room.addUser(1, 'alvin')
  room.addUser(2, 'teddy')

  expect(() => room.move(1, {row: 0, column: 0})).toThrow('Game has not started yet')
})

test('move when socketID is invalid', () => {
  const room = new Room('TICTACTOE')

  room.addUser(1, 'alvin')
  room.addUser(2, 'teddy')
  room.startGame(1)

  expect(() => room.move(3, {row: 0, column: 0})).toThrow('Invalid socketID')
})

test('move when game throw an error', () => {
  const room = new Room('TICTACTOE')

  room.addUser(1, 'alvin')
  room.addUser(2, 'teddy')
  room.startGame(1)

  const mockMove = jest.fn()
  mockMove.mockImplementation(() => {
    throw new Error('Some error')
  })

  TicTacToe.prototype.move = mockMove

  expect(() => room.move(1, {row: 0, column: 0})).toThrow('Some error')
})

test('move success and game has not ended', () => {
  const room = new Room('TICTACTOE')

  room.addUser(1, 'alvin')
  room.addUser(2, 'teddy')
  room.startGame(1)

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

  const result = room.move(1, {row: 0, column: 0})

  expect(result).toEqual({
    currentPlayer: 'O',
    board: newBoard
  })
})

test('move success and game has ended', () => {
  const room = new Room('TICTACTOE')

  room.addUser(1, 'alvin')
  room.addUser(2, 'teddy')
  room.startGame(1)

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

  const result = room.move(1, {row: 0, column: 0})

  expect(result).toEqual({
    currentPlayer: 'O',
    board: newBoard,
    gameOverInfo: { winner: 'X' }
  })
})
