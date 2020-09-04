const cors = require('cors')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const port = 5000
const RoomManager = require('./RoomManager')
const roomManager = new RoomManager()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.get('/games', (req, res) => {
  const games = [
    { name: 'Tic-Tac-Toe', code: 'TICTACTOE' },
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
  })

  socket.on('JOIN_ROOM', data => {
    log('JOIN_ROOM', data)

    const roomID = data.roomID
    const nickname = data.payload.nickname

    const room = roomManager.get(roomID)

    try {
      const user = room.addSocket(socketID, nickname)
      socket.join(roomID)
      socket.emit('JOIN_ROOM_ACCEPTED', user)
    } catch (e) {
      socket.emit('JOIN_ROOM_REJECTED', { message: e.toString() })
    }
  })

  socket.on('SEND_MESSAGE', data => {
    log('SEND_MESSAGE', data)

    const roomID = data.roomID
    const message = data.payload.message

    const room = roomManager.get(roomID)

    try {
      const result = room.sendMessage(socketID, message)
      io.to(roomID).emit('BROADCAST_MESSAGE', result)
    } catch (e) {
      socket.emit('SEND_MESSAGE_REJECTED', { message: e.toString() })
    }
  })

  socket.on('START_GAME', data => {
    log('START_GAME', data)

    const roomID = data.roomID

    const room = roomManager.get(roomID)

    try {
      const result = room.startGame()
      const currentPlayer = result.currentPlayer

      for (let socketID in result.playersMap) {
        const player = result.playersMap[socketID]
        io.to(socketID).emit('START_GAME_ACCEPTED', {
          currentPlayer,
          player
        })
      }
    } catch (e) {
      socket.emit('START_GAME_REJECTED', { message: e.toString() })
    }
  })

  socket.on('MOVE', data => {
    log('MOVE', data)

    const roomID = data.roomID

    const room = roomManager.get(roomID)

    try {
      const result = room.move(socketID, data.payload)
      io.to(roomID).emit('MOVE_ACCEPTED', result)
    } catch (e) {
      socket.emit('MOVE_REJECTED', { message: e.toString() })
    }
  })
})

http.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
