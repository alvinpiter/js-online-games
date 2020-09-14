const short = require('short-uuid')
const Room = require('./Room')

class RoomManager {
  constructor() {
    this.rooms = new Map() //Maps roomID to Room object
  }

  create(gameCode) {
    try {
      const roomID = short.generate()
      let room = new Room(gameCode)

      this.rooms.set(roomID, room)

      return {
        gameCode,
        id: roomID
      }
    } catch (e) {
      throw e
    }
  }

  get(roomID) {
    return this.rooms.get(roomID)
  }
}

module.exports = RoomManager
