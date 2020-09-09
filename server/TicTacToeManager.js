const TicTacToe = require('./TicTacToe')

class TicTacToeManager {
  constructor() {
    this.game = new TicTacToe()
    this.socketToPlayerMap = new Map()
    this.playing = false
  }

  startGame(actor, users) {
    if (users.length !== 2)
      throw new Error('Room is not full yet')

    this.game.reset()

    let result = []

    result.push({
      user: actor,
      payload: {
        currentPlayer: this.game.getCurrentPlayer(),
        player: 'X',
        board: this.game.getBoard()
      }
    })

    for (let user of users) {
      if (user.socketID !== actor.socketID) {
        result.push({
          user,
          payload: {
            currentPlayer: this.game.getCurrentPlayer(),
            player: 'O',
            board: this.game.getBoard()
          }
        })
      }
    }

    this.playing = true

    for (let r of result) {
      this.socketToPlayerMap.set(r.user.socketID, r.payload.player)
    }

    return result
  }

  move(user, payload) {
    if (!this.playing)
      throw new Error('Game has not started yet')

    const player = this.socketToPlayerMap.get(user.socketID)
    try {
      const board = this.game.move(player, payload)
      const currentPlayer = this.game.getCurrentPlayer()

      let result = { currentPlayer, board }

      if (this.game.hasEnded()) {
        result.gameOverInfo = { winner: this.game.getWinner() }
        this.playing = false
      }

      return result
    } catch(e) {
      throw e
    }
  }

  getNumberOfPlayers() {
    return 2
  }

  isPlaying() {
    return this.playing
  }

  resign(user) {
    const player = this.socketToPlayerMap.get(user.socketID)

    this.playing = false
    return {
      winner: (player === 'X' ? 'O' : 'X')
    }
  }
}

module.exports = TicTacToeManager
