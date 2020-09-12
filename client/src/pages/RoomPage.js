import React from 'react'
import io from 'socket.io-client'
import Button from '@material-ui/core/Button'
import NicknameForm from '../components/NicknameForm'
import ChatBox from '../components/ChatBox'
import TicTacToeGame from '../components/TicTacToeGame'
import ReversiGame from '../components/ReversiGame'
import SudokuGame from '../components/SudokuGame'
import Container from '../components/Container'
import NavBar from '../components/NavBar'

/*
There are 4 possible stages:
* USER_OUT -> user has not joined the room
* USER_IN -> user has joined the room
* USER_PLAYING -> users are playing
* GAME_OVER -> game over
*/
export default class RoomPage extends React.Component {
  constructor(props) {
    super(props)

    this.socket = null

    this.state = {
      user: null,
      stage: 'USER_OUT',
      startGameError: null
    }

    this.nicknameFormRef = React.createRef()
    this.chatBoxRef = React.createRef()
    this.gameRef = React.createRef()
  }

  componentDidMount() {
    this.socket = io("http://localhost:5000")

    this.socket.on('JOIN_ROOM_ACCEPTED', data => {
      const { user } = data

      this.setState({
        user,
        stage: 'USER_IN'
      })

      this.chatBoxRef.current.handleEvent('JOIN_ROOM_ACCEPTED', data)
    })

    this.socket.on('JOIN_ROOM_ACCEPTED_BROADCAST', data => {
      this.chatBoxRef.current.handleEvent('JOIN_ROOM_ACCEPTED_BROADCAST', data)
    })

    this.socket.on('JOIN_ROOM_REJECTED', data => {
      this.nicknameFormRef.current.handleEvent('JOIN_ROOM_REJECTED', data)
    })

    this.socket.on('LEFT_ROOM_BROADCAST', data => {
      this.chatBoxRef.current.handleEvent('LEFT_ROOM_BROADCAST', data)
    })

    this.socket.on('BROADCAST_MESSAGE', data => {
      this.chatBoxRef.current.handleEvent('BROADCAST_MESSAGE', data)
    })

    this.socket.on('START_GAME_REJECTED', data => {
      this.setState({
        startGameError: data.message
      })
    })

    this.socket.on('START_GAME_ACCEPTED', data => {
      this.setState({ stage: 'USER_PLAYING' })
      this.gameRef.current.handleEvent('START_GAME_ACCEPTED', data)
    })

    this.socket.on('MOVE_ACCEPTED', data => {
      if (data.gameOverInfo || data.gameOver)
        this.setState({ stage: 'GAME_OVER' })
      this.gameRef.current.handleEvent('MOVE_ACCEPTED', data)
    })

    this.socket.on('MOVE_REJECTED', data => {
      this.gameRef.current.handleEvent('MOVE_REJECTED', data)
    })

    this.socket.on('RESIGN_ACCEPTED', data => {
      this.setState({ stage: 'GAME_OVER' })
      this.gameRef.current.handleEvent('RESIGN_ACCEPTED', data)
    })
  }

  onSubmitNickname = (nickname) => {
    this.socket.emit(
      'JOIN_ROOM',
      {
        roomID: this.props.roomID,
        payload: { nickname }
      }
    )
  }

  onSendMessage = (text) => {
    this.socket.emit(
      'SEND_MESSAGE',
      {
        roomID: this.props.roomID,
        payload: { text }
      }
    )
  }

  onStartGame = () => {
    this.socket.emit('START_GAME', { roomID: this.props.roomID })
  }

  onResignGame = () => {
    const confirmation = window.confirm("Are you sure you want to resign?")
    if (confirmation) {
      this.socket.emit('RESIGN', { roomID: this.props.roomID })
    }
  }

  onMove = (payload) => {
    this.socket.emit(
      'MOVE',
      {
        roomID: this.props.roomID,
        payload
      }
    )
  }

  render() {
    const nicknameForm =
    <NicknameForm
      ref={this.nicknameFormRef}
      onSubmit={this.onSubmitNickname}
    />

    const chatBox =
    <ChatBox
      ref={this.chatBoxRef}
      onSend={this.onSendMessage}
    />

    let gameComponent
    switch (this.props.gameCode) {
      case 'TICTACTOE':
        gameComponent = <TicTacToeGame ref={this.gameRef} onMove={this.onMove} />
        break
      case 'REVERSI':
        gameComponent = <ReversiGame ref={this.gameRef} onMove={this.onMove} />
        break
      case 'SUDOKU':
        gameComponent = <SudokuGame ref={this.gameRef} onMove={this.onMove} />
        break
      default:
        gameComponent = null
    }

    const gameDiv =
    <div className="bg-green-100 flex justify-center p-4">
      {gameComponent}
    </div>

    const playButtonDiv =
    <div className="w-full">
      <div className="w-full flex justify-center p-4 pb-0">
        <Button
          color="primary"
          variant="contained"
          onClick={this.onStartGame}
          className="w-1/2"
        > Play </Button>
      </div>
      <div className="w-full flex justify-center">
        {
          this.state.startGameError !== null ?
          <p className="text-red-500">{this.state.startGameError}</p> :
          null
        }
      </div>
    </div>

    const resignButtonDiv =
    <div className="w-full flex justify-center p-4">
      <Button
        color="primary"
        variant="contained"
        onClick={this.onResignGame}
        className="w-1/2"
      > Resign </Button>
    </div>

    const userOutView = nicknameForm
    const userInView =
    <div className="flex space-x-2">
      <div className="w-1/3">
        {chatBox}
      </div>

      <div className="w-2/3">
        {playButtonDiv}
      </div>
    </div>

    const userPlayingView =
    <div className="flex space-x-2">
      <div className="w-1/3">
        {chatBox}
      </div>

      <div className="w-2/3">
        {resignButtonDiv}
        {gameDiv}
      </div>
    </div>

    const gameOverView =
    <div className="flex space-x-2">
      <div className="w-1/3">
        {chatBox}
      </div>

      <div className="w-2/3">
        {playButtonDiv}
        {gameDiv}
      </div>
    </div>

    const renderViewByStage = (stage) => {
      switch (stage) {
        case 'USER_OUT':
          return userOutView
        case 'USER_IN':
          return userInView
        case 'USER_PLAYING':
          return userPlayingView
        case 'GAME_OVER':
          return gameOverView
        default:
          return null
      }
    }

    return (
      <div>
        <NavBar page='Room' />
        <Container>
          <h1 className="text-3xl font-bold">{getGameNameFromCode(this.props.gameCode)} Room</h1>
          {renderViewByStage(this.state.stage)}
        </Container>
      </div>
    )
  }
}

function getGameNameFromCode(code) {
  switch (code) {
    case 'TICTACTOE':
      return 'Tic-tac-toe'
    case 'REVERSI':
      return 'Reversi'
    case 'SUDOKU':
      return 'Sudoku'
    default:
      return ''
  }
}
