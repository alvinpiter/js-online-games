const Room = require('./Room')
const TicTacToe = require('./TicTacToe')

test('create room with invalid game name', () => {
  expect(() => new Room('PUBG')).toThrow('Invalid game name')
})

test('addSocket when nickname already exists', () => {
  const room = new Room('TICTACTOE')

  room.addSocket(1, 'alvin')

  expect(() => room.addSocket(2, 'alvin')).toThrow('Nickname taken, try something else')
})

test('addSocket when room is full', () => {
  const room = new Room('TICTACTOE')

  room.addSocket(1, 'alvin')
  room.addSocket(2, 'teddy')

  expect(() => room.addSocket(3, 'smith')).toThrow('Room is full')
})

test('addSocket success', () => {
  const room = new Room('TICTACTOE')

  expect(room.addSocket(1, 'alvin')).toEqual('alvin')
  expect(room.getNickname(1)).toEqual('alvin')
  expect(room.getNumberOfPlayers()).toEqual(1)
})

test('removeSocket when socketID does not exist', () => {
  const room = new Room('TICTACTOE')

  expect(() => room.removeSocket(1)).toThrow('socketID does not exist')
})

test('removeSocket success', () => {
  const room = new Room('TICTACTOE')

  room.addSocket(1, 'alvin')
  expect(room.removeSocket(1)).toEqual('alvin')
  expect(room.getNickname(1)).toEqual(undefined)
  expect(room.getNumberOfPlayers()).toEqual(0)
})

test('sendMessage when socketID does not exist', () => {
  const room = new Room('TICTACTOE')

  expect(() => room.sendMessage(1, 'hehe')).toThrow('socketID does not exist')
})

test('sendMessage success', () => {
  const room = new Room('TICTACTOE')

  room.addSocket(1, 'alvin')
  room.addSocket(2, 'teddy')

  room.sendMessage(1, 'from alvin')

  expect(room.sendMessage(2, 'from teddy')).toEqual({nickname: 'teddy', message: 'from teddy'})
  expect(room.getMessageHistories()).toEqual([
    {nickname: 'alvin', message: 'from alvin'},
    {nickname: 'teddy', message: 'from teddy'}
  ])
})

test('startGame when room is not full yet', () => {
  const room = new Room('TICTACTOE')

  room.addSocket(1, 'alvin')

  expect(() => room.startGame()).toThrow('Room is not full yet')
})

test('startGame success', () => {
  const room = new Room('TICTACTOE')

  room.addSocket(1, 'alvin')
  room.addSocket(2, 'teddy')

  const result = room.startGame()
  expect(result.currentPlayer).toEqual('X')
  expect(result.playersMap[1]).not.toEqual(undefined)
  expect(result.playersMap[2]).not.toEqual(undefined)
  expect(result.playersMap[1]).not.toEqual(result.playersMap[2])

  expect(room.getPlayer(1)).not.toEqual(room.getPlayer(2))
  expect(room.isPlaying()).toEqual(true)
})

test('move when game has not started yet', () => {
  const room = new Room('TICTACTOE')

  room.addSocket(1, 'alvin')
  room.addSocket(2, 'teddy')

  const playerSocketID = room.getPlayerSocketID('X')
  expect(() => room.move(playerSocketID, {row: 0, column: 0})).toThrow('Game has not started yet')
})

test('move when socketID is invalid', () => {
  const room = new Room('TICTACTOE')

  room.addSocket(1, 'alvin')
  room.addSocket(2, 'teddy')
  room.startGame()

  expect(() => room.move(3, {row: 0, column: 0})).toThrow('Invalid socketID')
})

test('move when game throw an error', () => {
  const room = new Room('TICTACTOE')

  room.addSocket(1, 'alvin')
  room.addSocket(2, 'teddy')
  room.startGame()

  const playerSocketID = room.getPlayerSocketID('X')

  const mockMove = jest.fn()
  mockMove.mockImplementation(() => {
    throw new Error('Some error')
  })

  TicTacToe.prototype.move = mockMove

  expect(() => room.move(playerSocketID, {row: 0, column: 0})).toThrow('Some error')
})

test('move success and game has not ended', () => {
  const room = new Room('TICTACTOE')

  room.addSocket(1, 'alvin')
  room.addSocket(2, 'teddy')
  room.startGame()

  const playerSocketID = room.getPlayerSocketID('X')

  const lastMove = {
    player: 'X',
    row: 0,
    column: 0
  }

  const mockMove = jest.fn()
  mockMove.mockReturnValue(lastMove)
  TicTacToe.prototype.move = mockMove

  const mockHasEnded = jest.fn()
  mockHasEnded.mockReturnValue(false)
  TicTacToe.prototype.hasEnded = mockHasEnded

  const mockGetCurrentPlayer = jest.fn()
  mockGetCurrentPlayer.mockReturnValue('O')
  TicTacToe.prototype.getCurrentPlayer = mockGetCurrentPlayer

  const result = room.move(playerSocketID, {row: 0, column: 0})

  expect(result).toEqual({
    currentPlayer: 'O',
    lastMove
  })
})

test('move success and game has ended', () => {
  const room = new Room('TICTACTOE')

  room.addSocket(1, 'alvin')
  room.addSocket(2, 'teddy')
  room.startGame()

  const playerSocketID = room.getPlayerSocketID('X')

  const lastMove = {
    player: 'X',
    row: 0,
    column: 0
  }

  const mockMove = jest.fn()
  mockMove.mockReturnValue(lastMove)
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

  const result = room.move(playerSocketID, {row: 0, column: 0})

  expect(result).toEqual({
    currentPlayer: 'O',
    lastMove,
    endGameInfo: { winner: 'X' }
  })
})
