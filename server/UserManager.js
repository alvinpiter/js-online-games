const getRandomColor = require('./Colorize')
const { NicknameTakenError, InvalidSocketIDError } = require('./Errors')

class UserManager {
  constructor() {
    this.nicknamesSet = new Set()
    this.colorsSet = new Set()
    this.usersMap = new Map() //maps socketID to a user. A user is an object {nickname: .., color: ..}
  }

  addUser(socketID, nickname) {
    if (this.nicknamesSet.has(nickname))
      throw new NicknameTakenError()

    const user = {
      socketID,
      nickname,
      color: getRandomColor(this.colorsSet)
    }

    this.nicknamesSet.add(user.nickname)
    this.colorsSet.add(user.color)
    this.usersMap.set(socketID, user)

    return user
  }

  removeUser(socketID) {
    const user = this.getUser(socketID)

    this.nicknamesSet.delete(user.nickname)
    this.colorsSet.delete(user.color)
    this.usersMap.delete(socketID)

    return user
  }

  getUsers() {
    return Array.from(this.usersMap).map(entry => entry[1])
  }

  getUser(socketID) {
    const user = this.usersMap.get(socketID)
    if (user === undefined)
      throw new InvalidSocketIDError()
    else
      return user
  }

  getNumberOfUsers() {
    return this.nicknamesSet.size
  }
}

module.exports = UserManager
