const TicTacToeManager = require('./TicTacToeManager.js')

const users = [
  { socketID: 1, nickname: 'alvin', color: 'RED' },
  { socketID: 2, nickname: 'teddy', color: 'BLUE' }
]

test('resign', () => {
  const manager = new TicTacToeManager()

  manager.startGame(users[0], users)
  expect(manager.resign(users[0])).toEqual({resigner: users[0]})
  expect(manager.isPlaying()).toEqual(false)
})
