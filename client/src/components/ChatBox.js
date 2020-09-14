import React from 'react'
import UserSpan from './UserSpan'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

export default class ChatBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      messages: [],
      textValue: ""
    }

    this.messagesDivRef = React.createRef()
  }

  componentDidUpdate() {
    this.scrollMessagesDivToBottom()
  }

  handleEvent(type, data) {
    switch (type) {
      case 'JOIN_ROOM_ACCEPTED':
        this.handleJoinRoomAccepted(data)
        break
      case 'JOIN_ROOM_ACCEPTED_BROADCAST':
        this.handleJoinRoomAcceptedBroadcast(data)
        break
      case 'LEFT_ROOM_BROADCAST':
        this.handleLeftRoomBroadcast(data)
        break
      case 'BROADCAST_MESSAGE':
        this.handleBroadcastMessage(data)
        break
      default:
        console.error(`Event ${type} is not handled in ChatBox`)
    }
  }

  handleJoinRoomAccepted(data) {
    const { users, messages } = data

    this.setState({ users, messages }, this.scrollMessagesDivToBottom)
  }

  handleJoinRoomAcceptedBroadcast(user) {
    let newUsers = this.state.users.slice()
    newUsers.push(user)

    this.setState({ users: newUsers })
  }

  handleLeftRoomBroadcast(user) {
    let newUsers = []
    for (let u of this.state.users) {
      if (u.nickname !== user.nickname)
        newUsers.push(u)
    }

    this.setState({ users: newUsers })
  }

  handleBroadcastMessage(message) {
    let newMessages = this.state.messages.slice()
    newMessages.push(message)

    this.setState({ messages: newMessages }, this.scrollMessagesDivToBottom)
  }

  scrollMessagesDivToBottom = () => {
    this.messagesDivRef.current.scrollTop = this.messagesDivRef.current.scrollHeight
  }

  render() {
    return (
      <div className="space-y-2">
        <h1 className="text-center text-2xl font-bold"> Chat Box </h1>

        <div className="w-full p-2 bg-green-100 border border-black">
          Online users:
          {
            this.state.users.map((user, index) => <span key={index} className="ml-2"><UserSpan user={user} /></span>)
          }
        </div>

        <div className="w-full h-64 overflow-auto p-2 bg-green-100 border border-black" ref={this.messagesDivRef}>
          {
            this.state.messages.map((msg, index) =>
              <p key={index}><UserSpan user={msg.user}/>: {msg.text}</p>
            )
          }
        </div>

        <div className="flex">
          <TextField
            variant="outlined"
            placeholder="Write a message..."
            className="w-3/4"
            onChange={(event) => this.setState({textValue: event.target.value})}
            value={this.state.textValue}
          />
          <Button
            color="primary"
            variant="contained"
            className="w-1/4"
            onClick={() => {
              this.props.onSend(this.state.textValue)
              this.setState({textValue: ""})
            }}
          > Send </Button>
        </div>
      </div>
    )
  }
}
