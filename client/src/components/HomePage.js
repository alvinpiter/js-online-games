import React, { useState, useEffect } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function HomePage(props) {
  const [games, setGames] = useState([])
  const [isLoadingGames, setIsLoadingGames] = useState(true)
  const [selectedGameCode, setSelectedGameCode] = useState(null)
  const [room, setRoom] = useState(null)
  const [isLoadingRoom, setIsLoadingRoom] = useState(false)

  useEffect(() => {
    const loadGames = async () => {
      const result = await fetch('http://localhost:5000/games')
      const jsonResult = await result.json()

      setIsLoadingGames(false)
      setGames(jsonResult)
    }

    loadGames()
  }, [])

  const onChangeGame = (event, value) => {
    setSelectedGameCode(value.code)
  }

  const onClickSubmit = () => {
    const loadRoom = async () => {
      setIsLoadingRoom(true)

      const result = await fetch('http://localhost:5000/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameCode: selectedGameCode })
      })
      const jsonResult = await result.json()

      setIsLoadingRoom(false)
      setRoom(jsonResult)
    }

    if (selectedGameCode === null)
      return
    else
      loadRoom()
  }

  return (
    <div className="space-y-4">
      {
        isLoadingGames ?
        <CircularProgress /> :
        <GamePicker
          games={games}
          onChangeGame={onChangeGame}
          onClickSubmit={onClickSubmit}
        />
      }

      {
        isLoadingRoom ?
        <CircularProgress /> :
        (room === null ?
         null :
         <RoomInfo room={room} />
        )
      }
    </div>
  )
}

function GamePicker(props) {
  const { games, onChangeGame, onClickSubmit } = props

  return (
    <div className="flex space-x-2">
      <Autocomplete
        options={games}
        getOptionLabel={option => option.name}
        style={{ width: 300 }}
        renderInput={params => <TextField {...params} variant="outlined" />}
        onChange={onChangeGame}
      />

      <Button
        color="primary"
        variant="contained"
        onClick={onClickSubmit}
      > Submit </Button>
    </div>
  )
}

function RoomInfo(props) {
  const { room } = props
  const roomURL = getRoomURL(room.gameCode, room.id)

  return (
    <div>
      <p> Room created! Visit and share the link below to your opponent to start playing.</p>
      <TextField
        defaultValue={roomURL}
        InputProps={{ readOnly: true }}
        style={{ width: 500 }}
      />
    </div>
  )
}

function getRoomURL(gameCode, roomID) {
  const baseURL = 'http://localhost:3000'
  switch (gameCode) {
    case 'TICTACTOE':
      return `${baseURL}/tic-tac-toe/${roomID}`
    default:
      return baseURL
  }
}
