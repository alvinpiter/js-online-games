import React from 'react'
import io from 'socket.io-client'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

export default class RoomPage extends React.Component {
  constructor(props) {
    super(props)

    this.roomID = this.props.match.params.roomID
    this.socket = null

    this.state = {
      nicknameTextFieldValue: null,
      nicknameError: null,
      nickname: null
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

  render() {
    const nicknameForm =
    <div className="flex space-x-2">
      <TextField
        label="Nickname"
        variant="outlined"
        placeholder="Specify your nickname"
        onChange={this.onChangeNicknameTextField}
        helperText={this.state.nicknameError}
      />

      <Button
        color="primary"
        variant="contained"
        onClick={this.onSubmitNickname}
      > Submit </Button>
    </div>

    return (
      <div>
        {
          this.state.nickname === null ?
          nicknameForm :
          null
        }
        {
          this.state.nickname === null ?
          null :
          <h1> Hello, {this.state.nickname} </h1>
        }
      </div>
    )
  }
}
