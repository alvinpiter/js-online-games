const Reversi = require('./Reversi')
const {
  RoomIsNotFullError,
  GameHasNotStartedError
} = require('../../errors')

class ReversiManager {
  constructor() {
    this.game = new Reversi()
    this.userDetails = new Map()
    this.socketToPlayerMap = new Map()
    this.playing = false
  }

  startGame(actor, users) {
    if (users.length !== 2)
      throw new RoomIsNotFullError

    this.userDetails.clear()
    this.socketToPlayerMap.clear()

    this.game.reset()
    this.playing = true

    for (let user of users) {
      this.userDetails.set(user.socketID, user)
      this.socketToPlayerMap.set(
        user.socketID,
        user.socketID === actor.socketID ? 'W' : 'B'
      )
    }

    let result = []
    for (let user of users) {
      result.push({
        user,
        payload: {
          player: this.socketToPlayerMap.get(user.socketID),
          currentPlayer: this.game.getCurrentPlayer(),
          board: this.game.getBoard(),
          scores: this.getSortedScores(this.game.getScore())
        }
      })
    }

    return result
  }

  move(user, payload) {
    if (!this.isPlaying())
      throw new GameHasNotStartedError()

    const player = this.socketToPlayerMap.get(user.socketID)

    const board = this.game.move(player, payload)
    const sortedScores = this.getSortedScores(this.game.getScore())
    const currentPlayer = this.game.getCurrentPlayer()

    let result = { board, currentPlayer, scores: sortedScores }

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

  getSortedScores(scoreObj) {
    let scores = []
    for (let entry of this.userDetails) {
      const user = entry[1]
      const score = scoreObj[this.socketToPlayerMap.get(user.socketID)]
      scores.push({ user, score })
    }

    const sortedScores = scores.sort((a, b) => b.score - a.score)

    return sortedScores
  }
}

module.exports = ReversiManager
