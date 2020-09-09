import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

export default function NicknameForm(props) {
  const {
    error,
    onSubmit
  } = props

  const [nicknameValue, setNicknameValue] = useState("")

  return (
    <div className="flex space-x-2">
      <TextField
        label="Nickname"
        variant="outlined"
        placeholder="Specify your nickname"
        onChange={(event) => setNicknameValue(event.target.value)}
        error={error !== null}
        helperText={error}
      />

      <Button
        color="primary"
        variant="contained"
        onClick={() => onSubmit(nicknameValue)}
      > Submit </Button>
    </div>
  )
}
