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

io.on('connection', socket => {
  const socketID = socket.client.id
  console.log(`new socket connection! id: ${socketID}\n`)

  socket.on('disconnect', () => {
    console.log(`socket ${socketID} disconnected\n`)
  })

  socket.on('JOIN_ROOM', data => {
    console.log('JOIN_ROOM')
    console.log(data)
    console.log('\n')

    const roomID = data.roomID
    const nickname = data.payload.nickname

    const room = roomManager.get(roomID)

    try {
      const nick = room.addSocket(socketID, nickname)
      socket.emit('JOIN_ROOM_ACCEPTED', { nickname: nick })
    } catch (e) {
      socket.emit('JOIN_ROOM_REJECTED', { message: e.toString() })
    }
  })
})

http.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
