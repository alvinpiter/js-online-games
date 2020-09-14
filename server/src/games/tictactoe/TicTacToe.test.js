const TicTacToe = require('./TicTacToe')
const {
  NotYourTurnError,
  OutOfBoundsError,
  CellIsNotEmptyError
} = require('../../errors')

test('reset', () => {
  const game = new TicTacToe()

  game.setBoard([
    ['X', 'O', 'X'],
    [null, null, null],
    [null, null, null]
  ])

  game.reset()

  expect(game.getBoard()).toEqual([
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ])

  expect(game.getCurrentPlayer()).toEqual('X')
})

test('move with invalid player', () => {
  const game = new TicTacToe()

  const move = () => game.move('O', {row: 0, column: 0})

  expect(move).toThrowError(NotYourTurnError)
})

test('move with invalid row or column', () => {
  const game = new TicTacToe()

  const moves = [
    () => game.move('X', {row: -1, column: 0}),
    () => game.move('X', {row: 3, column: 0}),
    () => game.move('X', {row: 0, column: -1}),
    () => game.move('X', {row: 0, column: 3})
  ]

  for (let move of moves) {
    expect(move).toThrowError(OutOfBoundsError)
  }
})

test('move to occupied cell', () => {
  const game = new TicTacToe()

  game.move('X', {row: 0, column: 0})

  const move = () => game.move('O', {row: 0, column: 0})

  expect(move).toThrowError(CellIsNotEmptyError)
})

test('move success', () => {
  const game = new TicTacToe()

  game.move('X', {row: 0, column: 0})

  expect(game.getBoard()).toEqual([
    ['X', null, null],
    [null, null, null],
    [null, null, null]]
  )
  expect(game.getCurrentPlayer()).toEqual('O')
})

test('getWinner', () => {
  const testcases = [
    [
      ['X', 'O', null],
      ['O', 'X', null],
      ['O', null,'X']
    ],
    [
      ['O', 'O', 'X'],
      [null, 'X', null],
      ['X', 'O', null]
    ],
    [
      ['X', 'O', null],
      ['X', 'O', null],
      [null, 'O', 'X']
    ],
    [
      ['X', 'X', null],
      ['O', 'O', 'O'],
      ['X', null, null]
    ],
    [
      ['X', 'O', null],
      [null, null, null],
      [null, null, null]
    ]
  ]

  const expectations = ['X', 'X', 'O', 'O', null]

  for (let index = 0; index < testcases.length; index++) {
    const game = new TicTacToe()

    game.setBoard(testcases[index])
    expect(game.getWinner()).toEqual(expectations[index])
  }
})

test('hasEnded', () => {
  const testcases = [
    [
      ['X', 'O', null],
      [null, null, null],
      [null, null, null]
    ],
    [
      ['X', 'X', 'X'],
      [null, 'O', null],
      ['O', null,'O']
    ],
    [
      ['X', 'O', 'X'],
      ['O', 'O', 'X'],
      ['X', 'X', 'O']
    ]
  ]

  const expectations = [false, true, true]

  for (let index = 0; index < testcases.length; index++) {
    const game = new TicTacToe()

    game.setBoard(testcases[index])
    expect(game.hasEnded()).toEqual(expectations[index])
  }
})
