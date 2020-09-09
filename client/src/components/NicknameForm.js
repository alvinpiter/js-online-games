import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

export default class NicknameForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      nicknameValue: ""
    }
  }

  handleEvent(type, data) {
    switch (type) {
      case 'JOIN_ROOM_REJECTED':
        this.handleJoinRoomRejected(data)
        break
      default:
        console.error(`Event ${type} is not handled in NicknameForm`)
    }
  }

  handleJoinRoomRejected(data) {
    this.setState({ error: data.message })
  }

  render() {
    return (
      <div className="flex space-x-2">
        <TextField
          label="Nickname"
          variant="outlined"
          placeholder="Specify your nickname"
          onChange={(event) => this.setState({nicknameValue: event.target.value})}
          error={this.state.error !== null}
          helperText={this.state.error}
        />

        <Button
          color="primary"
          variant="contained"
          onClick={() => this.props.onSubmit(this.state.nicknameValue)}
        > Submit </Button>
      </div>
    )
  }
}
