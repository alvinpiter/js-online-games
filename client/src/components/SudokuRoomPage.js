import React from 'react'
import io from 'socket.io-client'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import SudokuBoard from './SudokuBoard'
import UserSpan from './UserSpan'

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
      nicknameTextFieldValue: "",
      nicknameError: null,
      user: null,
      users: [],
      messageHistories: [],
      messageTextFieldValue: "",
      board: null,
      cellColors: null,
      blockedCells: null,
      scores: null,
      stage: 'USER_OUT',
      startGameError: null,
      gameOverByResignation: false,
      resigner: null
    }
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
      const { board, cellColors, blockedCells, scores } = data

      this.setState({
        board,
        cellColors,
        blockedCells,
        scores,
        startGameError: null,
        stage: 'USER_PLAYING'
      })
    })

    this.socket.on('MOVE_ACCEPTED', data => {
      const { board, cellColors, scores, gameOver } = data

      this.setState({
        board,
        cellColors,
        scores
      })

      if (gameOver) {
        this.setState({
          stage: 'GAME_OVER',
          gameOverByResignation: false
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
        resigner: data.resigner
      })
    })
  }

  onChangeNicknameTextField = (event) => {
    this.setState({
      nicknameTextFieldValue: event.target.value
    })
  }

  onSubmitNickname = () => {
    this.socket.emit(
      'JOIN_ROOM',
      {
        roomID: this.roomID,
        payload: {
          nickname: this.state.nicknameTextFieldValue
        }
      }
    )
  }

  onChangeMessageTextField = (event) => {
    this.setState({
      messageTextFieldValue: event.target.value
    })
  }

  onSendMessage = () => {
    this.socket.emit(
      'SEND_MESSAGE',
      {
        roomID: this.roomID,
        payload: {
          message: this.state.messageTextFieldValue
        }
      }
    )

    this.setState({
      messageTextFieldValue: ""
    })
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

  onCellAssignment = (row, column, value) => {
    this.socket.emit(
      'MOVE',
      {
        roomID: this.roomID,
        payload: { row, column, value }
      }
    )
  }

  render() {
    const nicknameForm =
    <div className="flex space-x-2">
      <TextField
        label="Nickname"
        variant="outlined"
        placeholder="Specify your nickname"
        onChange={this.onChangeNicknameTextField}
        error={this.state.nicknameError !== null}
        helperText={this.state.nicknameError}
      />

      <Button
        color="primary"
        variant="contained"
        onClick={this.onSubmitNickname}
      > Submit </Button>
    </div>

    const chatBox =
    <div className="space-y-2">
      <h1 className="text-center"> Chat Box </h1>
      <div className="w-full bg-gray-200">
        Online users:
        {
          this.state.users.map(user => <span className="ml-2"><UserSpan user={user} /></span>)
        }
      </div>
      <div className="w-full h-64 overflow-auto bg-gray-200">
        {
          this.state.messageHistories.map((msg, index) =>
            <p key={index}> <UserSpan user={msg.user} />: {msg.text} </p>
          )
        }
      </div>

      <div className="flex">
        <TextField
          variant="outlined"
          placeholder="Write a message..."
          className="w-3/4"
          onChange={this.onChangeMessageTextField}
          value={this.state.messageTextFieldValue}
        />
        <Button
          color="primary"
          variant="contained"
          className="w-1/4"
          onClick={this.onSendMessage}
        > Send </Button>
      </div>
    </div>

    const gameDiv =
    <div className="bg-blue-200 flex justify-center p-4">
      <SudokuBoard
        board={this.state.board}
        blockedCells={this.state.blockedCells}
        cellColors={this.state.cellColors}
        onCellAssignment={this.onCellAssignment}
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

    const scoresDiv = <ScoresDiv scores={this.state.scores} />
    const gameOverInfo =
    <div>
      {
        this.state.gameOverByResignation ?
        <p><UserSpan user={this.state.resigner} /> ends the game </p> :
        <p> Game over! </p>
      }
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
        {scoresDiv}
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
        {scoresDiv}
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

function ScoresDiv(props) {
  const { scores } = props
  return (
    <div>
      <ol>
      {
        scores.map(entry => <li><UserSpan user={entry.user} />: {entry.score} </li>)
      }
      </ol>
    </div>
  )
}
