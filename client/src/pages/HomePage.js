import React, { useState, useEffect, useRef } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '../components/Container'
import Spinner from '../components/Spinner'
import NavBar from '../components/NavBar'
import Alert from '@material-ui/lab/Alert'

export default function HomePage(props) {
  const [games, setGames] = useState([])
  const [isLoadingGames, setIsLoadingGames] = useState(true)
  const [loadingGamesError, setLoadingGamesError] = useState(null)

  const [selectedGameCode, setSelectedGameCode] = useState(null)

  const [room, setRoom] = useState(null)
  const [isLoadingRoom, setIsLoadingRoom] = useState(false)
  const [loadingRoomError, setLoadingRoomError] = useState(null)

  useEffect(() => {
    document.title = 'JS Games | Home'
    const loadGames = async () => {
      try {
        const result = await fetch(`${process.env.REACT_APP_GAME_SERVER_HOST}/games`)
        const jsonResult = await result.json()

        setIsLoadingGames(false)
        setGames(jsonResult)
      } catch (e) {
        setIsLoadingGames(false)
        setLoadingGamesError(e)
      }
    }

    loadGames()
  }, [])

  const onChangeGame = (event, value) => {
    setSelectedGameCode(value.code)
  }

  const onClickSubmit = () => {
    const loadRoom = async () => {
      try {
        setIsLoadingRoom(true)
        setLoadingRoomError(null)

        const result = await fetch(`${process.env.REACT_APP_GAME_SERVER_HOST}/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameCode: selectedGameCode })
        })
        const jsonResult = await result.json()

        setIsLoadingRoom(false)
        setRoom(jsonResult)
      } catch (e) {
        setIsLoadingRoom(false)
        setLoadingRoomError(e)
      }
    }

    if (selectedGameCode === null)
      return
    else
      loadRoom()
  }

  return (
    <div>
      <NavBar page='Home' />
      <Container>
        {
          loadingGamesError === null ?
          null :
          <Alert severity="error">{loadingGamesError.message}</Alert>
        }

        {
          isLoadingGames ?
          <Spinner /> :
          <DisplayIfNotError error={loadingGamesError !== null}>
            <GamePicker
              games={games}
              onChangeGame={onChangeGame}
              onClickSubmit={onClickSubmit}
            />
          </DisplayIfNotError>
        }

        {
          loadingRoomError === null ?
          null :
          <Alert severity="error">{loadingRoomError.message}</Alert>
        }

        {
          isLoadingRoom ?
          <Spinner /> :
          <DisplayIfNotError error={loadingRoomError !== null}>
            <RoomInfo room={room} />
          </DisplayIfNotError>
        }
      </Container>
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
        renderInput={params => <TextField {...params} variant="outlined" placeholder="Choose a game" />}
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
  const [copied, setCopied] = useState(false)
  const textField = useRef(null)

  const onCopy = () => {
    textField.current.select()
    document.execCommand("copy")

    setCopied(true)
  }

  if (room == null)
    return null

  return (
    <div>
      <p> Room created! Visit and share the link below to your opponent to start playing.</p>
      <div className="flex space-x-2">
        <TextField
          inputRef={textField}
          value={getRoomURL(room)}
          inputProps={{ readOnly: true }}
          style={{ width: 500 }}
        />

        <Button
          color="primary"
          variant="contained"
          onClick={onCopy}
        >
          {copied ? 'Copied!' : 'Copy' }
        </Button>
      </div>
    </div>
  )
}

function getRoomURL(room) {
  const { id, gameCode } = room

  const baseURL = window.location.origin
  switch (gameCode) {
    case 'TICTACTOE':
      return `${baseURL}/tic-tac-toe/${id}`
    case 'REVERSI':
      return `${baseURL}/reversi/${id}`
    case 'SUDOKU':
      return `${baseURL}/sudoku/${id}`
    default:
      return baseURL
  }
}

function DisplayIfNotError(props) {
  const { error } = props

  if (error)
    return null
  else {
    return (
      <div>
        {props.children}
      </div>
    )
  }
}
