const { hasUncaughtExceptionCaptureCallback } = require('process')
const MessageManager = require('./MessageManager')

test('addMessage success only maintain last 50 messages', () => {
  const users = [
    { socketID: 1, nickname: 'alvin', color: 'GREEN' },
    { socketID: 2, nickname: 'teddy', color: 'BLUE' }
  ]

  const manager = new MessageManager()

  const messages = []
  for (let i = 0; i < 60; i++) {
    const user = users[Math.floor(Math.random() * 2)]
    const text = Math.floor(Math.random() * 100).toString()
    messages.push({ user, text })

    manager.addMessage(user, text)
  }

  const savedMessages = manager.getMessages()

  expect(savedMessages.length).toEqual(50)

  //Skip first 10 messages
  for (let i = 10; i < 60; i++) {
    expect(savedMessages[i - 10]).toEqual(messages[i])
  }
})
