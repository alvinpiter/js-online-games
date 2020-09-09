const UserManager = require('./UserManager')
const MessageManager = require('./MessageManager')
const TicTacToeManager = require('./TicTacToeManager')
const SudokuManager = require('./SudokuManager')

class Room {
  constructor(gameCode) {
    this.userManager = new UserManager()
    this.messageManager = new MessageManager()
    this.gameManager = null

    switch (gameCode) {
      case 'TICTACTOE':
        this.gameManager = new TicTacToeManager()
        break
      case 'SUDOKU':
        this.gameManager = new SudokuManager()
        break
      default:
        throw new Error('Invalid game name')
    }
  }

  addUser(socketID, nickname) {
    if (this.getNumberOfUsers() === this.gameManager.getNumberOfPlayers())
      throw new Error('Room is full')

    return this.userManager.addUser(socketID, nickname)
  }

  removeUser(socketID) {
    return this.userManager.removeUser(socketID)
  }

  getNumberOfUsers() {
    return this.userManager.getNumberOfUsers()
  }

  isPlaying() {
    return this.gameManager.isPlaying()
  }

  addMessage(socketID, text) {
    const user = this.userManager.getUser(socketID)

    return this.messageManager.addMessage(user, text)
  }

  getUsers() {
    return this.userManager.getUsers()
  }

  getMessages() {
    return this.messageManager.getMessages()
  }

  startGame(socketID) {
    const actor = this.userManager.getUser(socketID)
    const users = this.userManager.getUsers()

    return this.gameManager.startGame(actor, users)
  }

  move(socketID, payload) {
    const user = this.userManager.getUser(socketID)

    return this.gameManager.move(user, payload)
  }

  resign(socketID) {
    const user = this.userManager.getUser(socketID)

    return this.gameManager.resign(user)
  }
}

module.exports = Room
