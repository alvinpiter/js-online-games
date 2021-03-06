const Reversi = require('./Reversi')
const {
  CellIsNotEmptyError,
  OutOfBoundsError,
  InvalidMoveError,
  NotYourTurnError
} = require('../../errors')

test('reset', () => {
  const game = new Reversi()

  game.reset()

  const expectedBoard = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null,  'W',  'B', null, null, null],
    [null, null, null,  'B',  'W', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
  ]

  expect(game.getBoard()).toEqual(expectedBoard)
  expect(game.getCurrentPlayer()).toEqual('W')
})

test('getPlayers', () => {
  const game = new Reversi()

  expect(game.getPlayers()).toEqual(['W', 'B'])
})

test('move with invalid player', () => {
  const game = new Reversi()

  expect(() => game.move('B', {row: 3, column: 2})).toThrowError(NotYourTurnError)
})

test('move with invalid row or column', () => {
  const game = new Reversi()

  expect(() => game.move('W', {row: -1, column: 0})).toThrowError(OutOfBoundsError)
})

test('move to occupied cell', () => {
  const game = new Reversi()

  expect(() => game.move('W', {row: 4, column: 4})).toThrowError(CellIsNotEmptyError)
})

test('move that does not flip any cell', () => {
  const game = new Reversi()

  expect(() => game.move('W', {row: 0, column: 0})).toThrowError(InvalidMoveError)
})

test('move success', () => {
  const boards = [
    [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null,  'B'],
      [null, null,  'B', null, null, null,  'W', null],
      [null, null, null, null, null,  'W', null, null],
      [ 'W',  'W',  'W',  'W', null,  'B', null, null],
      [null, null,  'W',  'W',  'B',  'W', null, null],
      [null,  'B',  'W', null,  'W', null, null, null],
      [null, null, null, null,  'B', null, null,  'B']
    ],
    [
      [null, null, null, null, null, null, null, null],
      [null,  'B', null,  'B', null,  'B', null, null],
      [null, null,  'W',  'W',  'W', null, null, null],
      [null,  'B',  'W', null,  'W',  'B', null, null],
      [null, null,  'W',  'W',  'W', null, null, null],
      [null,  'B', null,  'B', null,  'B', null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null]
    ]
  ]

  const moves = [
    {row: 4, column: 4},
    {row: 3, column: 3}
  ]

  const expectedBoards = [
    [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null,  'B'],
      [null, null,  'B', null, null, null,  'B', null],
      [null, null, null, null, null,  'B', null, null],
      [ 'W',  'W',  'W',  'W',  'B',  'B', null, null],
      [null, null,  'W',  'W',  'B',  'W', null, null],
      [null,  'B',  'W', null,  'W', null, null, null],
      [null, null, null, null,  'B', null, null,  'B']
    ],
    [
      [null, null, null, null, null, null, null, null],
      [null,  'B', null,  'B', null,  'B', null, null],
      [null, null,  'B',  'B',  'B', null, null, null],
      [null,  'B',  'B',  'B',  'B',  'B', null, null],
      [null, null,  'B',  'B',  'B', null, null, null],
      [null,  'B', null,  'B', null,  'B', null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null]
    ]
  ]

  for (let idx = 0; idx < boards.length; idx++) {
    const game = new Reversi()
    game.setCurrentPlayer('B')
    game.setBoard(boards[idx])

    expect(game.move('B', moves[idx])).toEqual(expectedBoards[idx])
    expect(game.getCurrentPlayer()).toEqual('W')
  }
})

test('hasEnded when there is no valid move for current player', () => {
  //Taken from wikipedia (https://en.wikipedia.org/wiki/Reversi)
  //Vlasáková 1 – 63 Schotte (European Grand Prix Prague 2011)
  const board = [
    ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
    ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
    ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
    ['W', 'W', 'W', 'W', 'W', 'W', 'W', null],
    ['W', 'W', 'W', 'W', 'W', 'W', null, null],
    ['W', 'W', 'W', 'W', 'W', 'W', null, 'B'],
    ['W', 'W', 'W', 'W', 'W', 'W', 'W', null],
    ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W']
  ]

  const game = new Reversi()
  game.setCurrentPlayer('B')
  game.setBoard(board)

  expect(game.hasEnded()).toEqual(true)
})

test('hasEnded when there is valid move for current player', () => {
  const game = new Reversi()

  expect(game.hasEnded()).toEqual(false)
})

test('getScore', () => {
  const board = [
    [null, null, null, null, null, null, null, null],
    [null,  'B', null,  'B', null,  'B', null, null],
    [null, null,  'W',  'W',  'W', null, null, null],
    [null,  'B',  'W', null,  'W',  'B', null, null],
    [null, null,  'W',  'W',  'W', null, null, null],
    [null,  'B', null,  'B', null,  'B', null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
  ]

  const game = new Reversi()
  game.setBoard(board)

  expect(game.getScore()).toEqual({
    'W': 8,
    'B': 8
  })
})

test('getWinner', () => {
  const bWins = [
    [null, null, null, null, null, null, null, null],
    [null,  'B', null,  'B', null,  'B', null, null],
    [null, null,  'W',  'W',  'W', null, null, null],
    [null,  'B',  'W', null,  'W',  'B', null, null],
    [null, null,  'W',  'W',  'W', null, null, null],
    [null,  'B', null,  'B', null,  'B',  'B', null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
  ]

  const wWins = [
    [null, null, null, null, null, null, null, null],
    [null,  'B', null,  'B', null,  'B', null, null],
    [null, null,  'W',  'W',  'W', null, null, null],
    [null,  'B',  'W', null,  'W',  'B', null, null],
    [null, null,  'W',  'W',  'W', null, null, null],
    [null,  'B', null,  'B', null,  'B',  'W', null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
  ]

  const tie = [
    [null, null, null, null, null, null, null, null],
    [null,  'B', null,  'B', null,  'B', null, null],
    [null, null,  'W',  'W',  'W', null, null, null],
    [null,  'B',  'W', null,  'W',  'B', null, null],
    [null, null,  'W',  'W',  'W', null, null, null],
    [null,  'B', null,  'B', null,  'B', null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
  ]

  const boards = [bWins, wWins, tie]
  const expectedResult = ['B', 'W', null]

  for (let i = 0; i < boards.length; i++) {
    const game = new Reversi()
    game.setBoard(boards[i])

    expect(game.getWinner()).toEqual(expectedResult[i])
  }
})
