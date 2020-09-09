const Reversi = require('./Reversi')
const {
  RoomIsNotFullError,
  GameHasNotStartedError
} = require('./Errors')

class ReversiManager {
  constructor() {
    this.game = new Reversi()
    this.userDetails = new Map()
    this.socketToPlayerMap = new Map()
    this.userScores = new Map()
    this.playing = false
  }

  startGame(actor, users) {
    if (users.length !== 2)
      throw new RoomIsNotFullError

    this.game.reset()

    let result = []
    result.push({
      user: actor,
      payload: {
        currentPlayer: this.game.getCurrentPlayer(),
        player: 'W',
        board: this.game.getBoard()
      }
    })

    for (let user of users) {
      if (user.socketID !== actor.socketID) {
        result.push({
          user,
          payload: {
            currentPlayer: this.game.getCurrentPlayer(),
            player: 'B',
            board: this.game.getBoard()
          }
        })
        break
      }
    }

    this.playing = true

    for (let r of result) {
      this.userDetails.set(r.user.socketID, r.user)
      this.socketToPlayerMap.set(r.user.socketID, r.payload.player)
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
