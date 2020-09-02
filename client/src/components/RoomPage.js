import React from 'react'
import io from 'socket.io-client'

export default class RoomPage extends React.Component {
  constructor(props) {
    super(props)

    this.roomID = this.props.match.params.roomID
    this.socket = null
  }

  componentDidMount() {
    this.socket = io("http://localhost:5000")
  }

  render() {
    return <h1> RoomPage! </h1>
  }
}
