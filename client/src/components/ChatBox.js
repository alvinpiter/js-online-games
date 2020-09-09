import React, { useState } from 'react'
import UserSpan from './UserSpan'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

export default function ChatBox(props) {
  const {
    users,
    messages,
    onSend
  } = props

  const [textValue, setTextValue] = useState("")

  return (
    <div className="space-y-2">
      <h1 className="text-center"> Chat Box </h1>
      <div className="w-full bg-gray-200">
        Online users:
        {
          users.map(user => <span className="ml-2"><UserSpan user={user} /></span>)
        }
      </div>
      <div className="w-full h-64 overflow-auto bg-gray-200">
        {
          messages.map((msg, index) =>
            <p key={index}><UserSpan user={msg.user}/>: {msg.text}</p>
          )
        }
      </div>

      <div className="flex">
        <TextField
          variant="outlined"
          placeholder="Write a message..."
          className="w-3/4"
          onChange={(event) => setTextValue(event.target.value)}
          value={textValue}
        />
        <Button
          color="primary"
          variant="contained"
          className="w-1/4"
          onClick={() => {
            onSend(textValue)
            setTextValue("")
          }}
        > Send </Button>
      </div>
    </div>
  )
}
