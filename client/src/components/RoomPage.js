import React from 'react'
import io from 'socket.io-client'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import TicTacToeBoard from './TicTacToeBoard'

export default class RoomPage extends React.Component {
  constructor(props) {
    super(props)

    this.roomID = this.props.match.params.roomID
    this.socket = null

    this.state = {
      nicknameTextFieldValue: "",
      nicknameError: null,
      nickname: null,
      messageHistories: [],
      messageTextFieldValue: ""
    }
  }

  componentDidMount() {
    this.socket = io("http://localhost:5000")

    this.socket.on('JOIN_ROOM_ACCEPTED', data => {
      const { nickname } = data

      this.setState({
        nicknameError: null,
        nickname: nickname
      })
    })

    this.socket.on('JOIN_ROOM_REJECTED', data => {
      const { message } = data

      this.setState({
        nicknameError: message
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
      console.log('START_GAME_REJECTED')
      console.log(data)
    })

    this.socket.on('START_GAME_ACCEPTED', data => {
      console.log('START_GAME_ACCEPTED')
      console.log(data)
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

  onClickTicTacToeCell = (row, column) => {
    console.log({row, column})
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
    <div className="space-y-2 w-1/3">
      <h1 className="text-center"> Chat Box </h1>
      <div className="w-full h-64 overflow-auto bg-gray-400">
        {
          this.state.messageHistories.map((msg, index) => {
            return <p key={index}>{msg.nickname}: {msg.message}</p>
          })
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
    <div className="w-2/3 bg-blue-200">
      <TicTacToeBoard
        board={[['X', null, null], [null, 'O', null], [null, null, null]]}
        onClickCell={this.onClickTicTacToeCell}
      />
    </div>

    const chatBoxAndGameDiv =
    <div className="flex space-x-2">
      {chatBox}
      {gameDiv}
    </div>

    return (
      <div>
        {
          this.state.nickname === null ?
          nicknameForm :
          null
        }
        <Button
          color="primary"
          variant="contained"
          onClick={this.onStartGame}
        > Play </Button>
        {
          this.state.nickname === null ?
          null :
          chatBoxAndGameDiv
        }
      </div>
    )
  }
}
