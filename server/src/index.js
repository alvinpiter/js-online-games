const cors = require('cors')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const port = process.env.PORT || 5000
const RoomManager = require('./room/RoomManager')
const roomManager = new RoomManager()
const socketRoomID = new Map()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.get('/games', (req, res) => {
  const games = [
    { name: 'Tic-Tac-Toe', code: 'TICTACTOE' },
    { name: 'Reversi', code: 'REVERSI' },
    { name: 'Sudoku', code: 'SUDOKU' }
  ]

  res.json(games)
})

app.post('/rooms', (req, res) => {
  const gameCode = req.body.gameCode
  try {
    const result = roomManager.create(gameCode)
    res.json(result)
  } catch (e) {
    res.json(e)
  }
})

function log(command, data) {
  console.log(command)
  console.log(data)
  console.log('\n')
}

io.on('connection', socket => {
  const socketID = socket.client.id

  console.log(`new socket connection! id: ${socketID}\n`)

  socket.on('disconnect', () => {
    console.log(`socket ${socketID} disconnected\n`)

    const roomID = socketRoomID.get(socketID)

    try {
      const room = roomManager.get(roomID)
      const user = room.removeUser(socketID)
      io.to(roomID).emit('LEFT_ROOM_BROADCAST', user)
    } catch (e) {
      console.log("eror")
    }
  })

  socket.on('JOIN_ROOM', data => {
    log('JOIN_ROOM', data)

    const roomID = data.roomID
    const nickname = data.payload.nickname

    try {
      const room = roomManager.get(roomID)
      const users = room.getUsers()
      const user = room.addUser(socketID, nickname)
      const messages = room.getMessages()

      socketRoomID.set(socketID, roomID)

      socket.join(roomID)
      socket.emit('JOIN_ROOM_ACCEPTED', { user, users, messages })
      io.to(roomID).emit('JOIN_ROOM_ACCEPTED_BROADCAST', user)
    } catch (e) {
      socket.emit('JOIN_ROOM_REJECTED', { message: e.toString() })
    }
  })

  socket.on('SEND_MESSAGE', data => {
    log('SEND_MESSAGE', data)

    const roomID = data.roomID
    const text = data.payload.text

    try {
      const room = roomManager.get(roomID)
      const result = room.addMessage(socketID, text)
      io.to(roomID).emit('BROADCAST_MESSAGE', result)
    } catch (e) {
      socket.emit('SEND_MESSAGE_REJECTED', { message: e.toString() })
    }
  })

  socket.on('START_GAME', data => {
    log('START_GAME', data)

    const roomID = data.roomID

    try {
      const room = roomManager.get(roomID)
      const result = room.startGame(socketID)

      for (let r of result) {
        const socketID = r.user.socketID
        const payload = r.payload

        io.to(socketID).emit('START_GAME_ACCEPTED', payload)
      }
    } catch (e) {
      socket.emit('START_GAME_REJECTED', { message: e.toString() })
    }
  })

  socket.on('MOVE', data => {
    log('MOVE', data)

    const roomID = data.roomID

    try {
      const room = roomManager.get(roomID)
      const result = room.move(socketID, data.payload)
      io.to(roomID).emit('MOVE_ACCEPTED', result)
    } catch (e) {
      let result = {
        message: e.message,
        data: e.data
      }

      socket.emit('MOVE_REJECTED', result)
    }
  })

  socket.on('RESIGN', data => {
    log('RESIGN', data)

    const roomID = data.roomID

    try {
      const room = roomManager.get(roomID)
      const result = room.resign(socketID)
      io.to(roomID).emit('RESIGN_ACCEPTED', result)
    } catch (e) {
      console.log(e)
    }
  })
})

http.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
