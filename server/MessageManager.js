class MessageManager {
  constructor() {
    this.messages = []
  }

  addMessage(user, text) {
    const message = { user, text }
    this.messages.push(message)

    return message
  }

  getMessages() {
    return this.messages
  }
}

module.exports = MessageManager
