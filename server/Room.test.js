const Room = require('./Room')
const TicTacToe = require('./TicTacToe')
const {
  RoomIsFullError,
  GameIsOnGoingError,
  InvalidSocketIDError
} = require('./Errors')

test('create room with invalid game name', () => {
  expect(() => new Room('PUBG')).toThrow('Invalid game name')
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

test('addMessage when socketID is invalid', () => {
  const room = new Room('TICTACTOE')

  expect(() => room.addMessage(1, 'hehe')).toThrowError(InvalidSocketIDError)
})

test('startGame when socketID is invalid', () => {
  const room = new Room('TICTACTOE')

  expect(() => room.startGame(1)).toThrowError(InvalidSocketIDError)
})

test('move when socketID is invalid', () => {
  const room = new Room('TICTACTOE')

  room.addUser(1, 'alvin')
  room.addUser(2, 'teddy')
  room.startGame(1)

  expect(() => room.move(3, {row: 0, column: 0})).toThrowError(InvalidSocketIDError)
})
