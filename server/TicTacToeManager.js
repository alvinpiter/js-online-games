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

    let playerAssignments = []
    playerAssignments.push({
      user: actor,
      player: 'X'
    })

    for (let user of users) {
      if (user.socketID !== actor.socketID) {
        playerAssignments.push({
          user,
          player: 'O'
        })
      }
    }

    this.game.reset()
    this.playing = true

    for (let assignment of playerAssignments) {
      this.socketToPlayerMap.set(assignment.user.socketID, assignment.player)
    }

    return {
      currentPlayer: this.game.getCurrentPlayer(),
      playerAssignments
    }
  }

  move(user, payload) {
    if (!this.playing)
      throw new Error('Game has not started yet')

    const player = this.socketToPlayerMap.get(user.socketID)
    try {
      const lastMove = this.game.move(player, payload)
      const currentPlayer = this.game.getCurrentPlayer()

      let result = {
        lastMove,
        currentPlayer,
      }

      if (this.game.hasEnded())
        result.gameOverInfo = { winner: this.game.getWinner() }

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
