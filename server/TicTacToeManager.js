const TicTacToe = require('./TicTacToe')
const {
  RoomIsNotFullError,
  GameHasNotStartedError
} = require('./Errors')

class TicTacToeManager {
  constructor() {
    this.game = new TicTacToe()
    this.socketToPlayerMap = new Map()
    this.playing = false
  }

  startGame(actor, users) {
    if (users.length !== 2)
      throw new RoomIsNotFullError()

    this.socketToPlayerMap.clear()

    this.game.reset()
    this.playing = true

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

    for (let r of result) {
      this.socketToPlayerMap.set(r.user.socketID, r.payload.player)
    }

    return result
  }

  move(user, payload) {
    if (!this.playing)
      throw new GameHasNotStartedError()

    const player = this.socketToPlayerMap.get(user.socketID)

    const board = this.game.move(player, payload)
    const currentPlayer = this.game.getCurrentPlayer()

    let result = { currentPlayer, board }

    if (this.game.hasEnded()) {
      result.gameOverInfo = { winner: this.game.getWinner() }
      this.playing = false
    }

    return result

  }

  getNumberOfPlayers() {
    return 2
  }

  isPlaying() {
    return this.playing
  }

  resign(user) {
    this.playing = false
    return {
      resigner: user
    }
  }
}

module.exports = TicTacToeManager
