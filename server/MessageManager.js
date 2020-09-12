class MessageManager {
  constructor() {
    this.messages = []
  }

  addMessage(user, text) {
    const message = { user, text }

    if (this.messages.length === 50)
      this.messages.shift()

    this.messages.push(message)

    return message
  }

  getMessages() {
    return this.messages
  }
}

module.exports = MessageManager
