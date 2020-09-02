const TicTacToe = require('./TicTacToe')

class Room {
  constructor(gameCode) {
    this.nicknamesSet = new Set()
    this.nicknamesMap = new Map() //maps socketID to nickname
    this.playersMap = new Map() //maps socketID to a player in a game
    this.messageHistories = [] //{nickname: .., message: ..}
    this.game = null
    this.playing = false

    switch (gameCode) {
      case 'TICTACTOE':
        this.game = new TicTacToe()
        break
      default:
        throw new Error('Invalid game name')
    }
  }

  /*
    Add a new socket connection to the room.
    If the nickname exist, throw an error.
    If room is full, throw an error.

    On success, it returns the nickname.
  */
  addSocket(socketID, nickname) {
    if (this.nicknamesSet.has(nickname))
      throw new Error('Nickname taken, try something else')

    if (this.getNumberOfPlayers() === this.game.getNumberOfPlayers())
      throw new Error('Room is full')

    this.nicknamesSet.add(nickname)
    this.nicknamesMap.set(socketID, nickname)

    return nickname
  }

  /*
    If the socketID does not exist, throw an error.

    On success, it returns the nickname
  */
  removeSocket(socketID) {
    const nickname = this.nicknamesMap.get(socketID)
    if (nickname === undefined)
      throw new Error('socketID does not exist')
    else {
      this.nicknamesSet.delete(nickname)
      this.nicknamesMap.delete(socketID)

      return nickname
    }
  }

  getNickname(socketID) {
    return this.nicknamesMap.get(socketID)
  }

  getPlayer(socketID) {
    return this.playersMap.get(socketID)
  }

  getPlayerSocketID(player) {
    for (let socketID of this.playersMap.keys()) {
      if (this.playersMap.get(socketID) === player)
        return socketID
    }
  }

  getNumberOfPlayers() {
    return this.nicknamesSet.size
  }

  isPlaying() {
    return this.playing
  }

  /*
    If the socketID does not exist, throw an error.

    On success, return an object with format {nickname: ..., message: ...}
  */
  sendMessage(socketID, message) {
    const nickname = this.nicknamesMap.get(socketID)
    if (nickname === undefined)
      throw new Error('socketID does not exist')
    else {
      this.messageHistories.push({
        nickname,
        message
      })

      return {nickname, message}
    }
  }

  getMessageHistories() {
    return this.messageHistories
  }

  startGame() {
    if (this.getNumberOfPlayers() !== this.game.getNumberOfPlayers())
      throw new Error('Room is not full yet')

    let playersMap = {}

    const socketIDs = Array.from(this.nicknamesMap).map(entry => entry[0])
    const players = this.game.getPlayers()
    socketIDs.forEach((socketID, index) => {
      playersMap[socketID] = players[index]
      this.playersMap.set(socketID, players[index])
    })

    this.playing = true

    return {
      currentPlayer: this.game.getCurrentPlayer(),
      playersMap
    }
  }

  /*
    If the game has not started, throw an error
    If invalid socketID, throw an error
    If game throw an error, re-throw the error
    If game ended after a move, include endGameInfo in return value

    return value:
    {
      endGameInfo: { winner: ... }, //this is optional
      lastMove: {
        player: ..,
        row: ..,
        column: ..,
      },
      currentPlayer: ..
    }
  */
  move(socketID, payload) {
    if (!this.playing)
      throw new Error('Game has not started yet')

    const player = this.playersMap.get(socketID)
    if (player === undefined)
      throw new Error('Invalid socketID')

    try {
      const lastMove = this.game.move(player, payload)
      const currentPlayer = this.game.getCurrentPlayer()

      let result = {
        lastMove,
        currentPlayer
      }

      if (this.game.hasEnded())
        result.endGameInfo = { winner: this.game.getWinner() }

      return result
    } catch (e) {
      throw e
    }
  }
}

module.exports = Room
