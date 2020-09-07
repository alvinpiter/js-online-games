const Sudoku = require('./Sudoku')
const puzzleString = '004300209005009001070060043006002087190007400050083000600000105003508690042910300'
const solutionString = '864371259325849761971265843436192587198657432257483916689734125713528694542916378'

class SudokuManager {
  constructor() {
    this.game = new Sudoku(puzzleString, solutionString)
    this.userDetails = new Map()
    this.userBlockedCells = new Map()
    this.userScores = new Map()

    this.cellColors = []
  }

  startGame(actor, users) {
    this.userDetails.clear()
    this.userBlockedCells.clear()
    this.userScores.clear()
    this.cellColors = []
    for (let row = 0; row < 9; row++)
      this.cellColors.push(new Array(null, null, null, null, null, null, null, null, null))

    for (let user of users) {
      const socketID = user.socketID

      this.userDetails.set(socketID, user)

      let blockedCells = []
      for (let row = 0; row < 9; row++)
        blockedCells.push(new Array(false, false, false, false, false, false, false, false, false))

      this.userBlockedCells.set(socketID, blockedCells)
      this.userScores.set(socketID, 0)
    }
  }

  move(user, payload) {
    const { row, column, value } = payload

    try {
      const board = this.game.assign(row, column, value)

      this.cellColors[row][column] = user.color
      this.increaseScore(user)

      return {
        board,
        cellColors: this.cellColors,
        scores: this.getSortedScores(),
        gameOver: this.game.hasEnded()
      }
    } catch (e) {
      throw e
    }
  }

  increaseScore(user) {
    const socketID = user.socketID

    const score = this.userScores.get(socketID)
    this.userScores.set(socketID, score + 1)
  }

  getSortedScores() {
    const scores = Array.from(this.userScores).map(entry => {
      return {
        user: this.userDetails.get(entry[0]),
        score: entry[1]
      }
    })

    const sortedScores = scores.sort((a, b) => b.score - a.score)

    return sortedScores
  }
}

module.exports = SudokuManager
