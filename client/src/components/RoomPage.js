import React from 'react'
import io from 'socket.io-client'
import TicTacToeBoard from './TicTacToeBoard'
import Button from '@material-ui/core/Button'
import NicknameForm from './NicknameForm'
import ChatBox from './ChatBox'

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

    this.roomID = this.props.match.params.roomID
    this.socket = null

    this.state = {
      nicknameError: null,
      user: null,
      users: [],
      messageHistories: [],
      player: null,
      currentPlayer: null,
      board: [[null, null, null], [null, null, null], [null, null, null]],
      stage: 'USER_OUT',
      startGameError: null,
      gameOverByResignation: false,
      winner: null
    }
  }

  resetBoard() {
    this.setState({
      board: [[null, null, null], [null, null, null], [null, null, null]]
    })
  }

  componentDidMount() {
    this.socket = io("http://localhost:5000")

    this.socket.on('JOIN_ROOM_ACCEPTED', data => {
      const { user, users, messageHistories } = data

      this.setState({
        nicknameError: null,
        user,
        users,
        messageHistories,
        stage: 'USER_IN'
      })
    })

    this.socket.on('JOIN_ROOM_ACCEPTED_BROADCAST', data => {
      const newUsers = this.state.users.slice()
      newUsers.push(data)

      this.setState({
        users: newUsers
      })
    })

    this.socket.on('JOIN_ROOM_REJECTED', data => {
      const { message } = data

      this.setState({
        nicknameError: message
      })
    })

    this.socket.on('LEFT_ROOM_BROADCAST', data => {
      let newUsers = []
      for (let user of this.state.users) {
        if (user.nickname !== data.nickname)
          newUsers.push(user)
      }

      this.setState({
        users: newUsers
      })
    })

    this.socket.on('BROADCAST_MESSAGE', data => {
      let newMessageHistories = this.state.messageHistories.slice()
      newMessageHistories.push(data)

      this.setState({
        messageHistories: newMessageHistories
      })
    })

    this.socket.on('START_GAME_REJECTED', data => {
      this.setState({
        startGameError: data.message
      })
    })

    this.socket.on('START_GAME_ACCEPTED', data => {
      console.log(data)
      this.resetBoard()

      const { player, currentPlayer } = data
      this.setState({
        player,
        currentPlayer,
        startGameError: null,
        stage: 'USER_PLAYING'
      })
    })

    this.socket.on('MOVE_ACCEPTED', data => {
      const { lastMove, currentPlayer, gameOverInfo } = data

      let newBoard = []
      for (let row = 0; row < 3; row++)
        newBoard.push(this.state.board[row].slice())

      newBoard[lastMove.row][lastMove.column] = lastMove.player

      this.setState({
        currentPlayer,
        board: newBoard
      })

      if (gameOverInfo !== undefined) {
        this.setState({
          stage: 'GAME_OVER',
          gameOverByResignation: false,
          winner: gameOverInfo.winner
        })
      }
    })

    this.socket.on('MOVE_REJECTED', data => {
      console.log('MOVE_REJECTED', data)
    })

    this.socket.on('RESIGN_ACCEPTED', data => {
      this.setState({
        stage: 'GAME_OVER',
        gameOverByResignation: true,
        winner: data.winner
      })
    })
  }

  onSubmitNickname = (nickname) => {
    this.socket.emit(
      'JOIN_ROOM',
      {
        roomID: this.roomID,
        payload: { nickname }
      }
    )
  }

  onSendMessage = (message) => {
    this.socket.emit(
      'SEND_MESSAGE',
      {
        roomID: this.roomID,
        payload: { message }
      }
    )
  }

  onStartGame = () => {
    this.socket.emit('START_GAME', { roomID: this.roomID })
  }

  onResignGame = () => {
    const confirmation = window.confirm("Are you sure you want to resign?")
    if (confirmation) {
      this.socket.emit('RESIGN', { roomID: this.roomID })
    }
  }

  onClickTicTacToeCell = (row, column) => {
    this.socket.emit(
      'MOVE',
      {
        roomID: this.roomID,
        payload: { row, column }
      }
    )
  }

  render() {
    const nicknameForm =
    <NicknameForm
      error={this.state.nicknameError}
      onSubmit={this.onSubmitNickname}
    />

    const chatBox =
    <ChatBox
      users={this.state.users}
      messages={this.state.messageHistories}
      onSendMessage={this.onSendMessage}
    />

    const turnInfo =
    <div>
      <p className="text-center"> You are playing as <span className="font-bold">{this.state.player}</span></p>
      {
        this.state.player === this.state.currentPlayer ?
        <p className="text-center"> It's your turn </p> :
        <p className="text-center"> It's your opponent's turn </p>
      }
    </div>

    const resignationInfo =
    <p className="text-center">
      {
        this.state.winner === this.state.player ?
        'Your opponent resigned. You win!' :
        'You resigned. You lose!'
      }
    </p>

    let winnerInfo
    if (this.state.winner === null)
      winnerInfo = <p className="text-center"> Game over! It's a tie </p>
    else
      winnerInfo = <p className="text-center"> {this.state.winner === this.state.player ? 'You win!' : 'You lose!'} </p>

    const gameOverInfo =
    <div>
      {
        this.state.gameOverByResignation ?
        resignationInfo :
        winnerInfo
      }
    </div>

    const gameDiv =
    <div className="bg-blue-200 flex justify-center p-4">
      <TicTacToeBoard
        board={this.state.board}
        onClickCell={this.onClickTicTacToeCell}
      />
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
        {turnInfo}
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
        {gameOverInfo}
        {gameDiv}
      </div>
    </div>

    const renderByStage = (stage) => {
      switch (stage) {
        case 'USER_OUT':
          return userOutView
        case 'USER_IN':
          return userInView
        case 'USER_PLAYING':
          return userPlayingView
        default:
          return gameOverView
      }
    }

    return (
      <div>
        {renderByStage(this.state.stage)}
      </div>
    )
  }
}
