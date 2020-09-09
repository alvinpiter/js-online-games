const Sudoku = require('./Sudoku')
const { SudokuCellMismatchError } = require('./Errors')
const puzzleString = '064371259025849761901265843430192587198057432257403916689734125713528694542916378'
const solutionString = '864371259325849761971265843436192587198657432257483916689734125713528694542916378'

class SudokuManager {
  constructor() {
    this.game = new Sudoku(puzzleString, solutionString)
    this.userDetails = new Map()
    this.userBlockedCells = new Map()
    this.userScores = new Map()
    this.playing = false

    this.cellColors = []
  }

  startGame(actor, users) {
    this.userDetails.clear()
    this.userBlockedCells.clear()
    this.userScores.clear()
    this.cellColors = []
    for (let row = 0; row < 9; row++)
      this.cellColors.push(new Array(null, null, null, null, null, null, null, null, null))
    this.playing = true
    this.game = new Sudoku(puzzleString, solutionString)

    for (let user of users) {
      const socketID = user.socketID

      this.userDetails.set(socketID, user)

      let blockedCells = []
      for (let row = 0; row < 9; row++)
        blockedCells.push(new Array(false, false, false, false, false, false, false, false, false))

      this.userBlockedCells.set(socketID, blockedCells)
      this.userScores.set(socketID, 0)
    }

    let result = []
    for (let user of users) {
      const socketID = user.socketID

      result.push({
        user,
        payload: {
          board: this.game.getBoard(),
          cellColors: this.cellColors,
          blockedCells: this.userBlockedCells.get(socketID),
          scores: this.getSortedScores()
        }
      })
    }

    return result
  }

  move(user, payload) {
    if (!this.playing)
      throw new Error('Game has not started yet')

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
      if (e instanceof SudokuCellMismatchError) {
        this.blockCell(user, row, column)
        throw new SudokuCellMismatchError({blockedCells: this.userBlockedCells.get(user.socketID)})
      } else
        throw e
    }
  }

  increaseScore(user) {
    const socketID = user.socketID

    const score = this.userScores.get(socketID)
    this.userScores.set(socketID, score + 1)
  }

  blockCell(user, row, column) {
    let blockedCells = this.userBlockedCells.get(user.socketID)
    blockedCells[row][column] = true

    this.userBlockedCells.set(user.socketID, blockedCells)
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

  getNumberOfPlayers() {
    return 5
  }

  resign(actor) {
    this.playing = false
    return {
      resigner: actor
    }
  }
}

module.exports = SudokuManager