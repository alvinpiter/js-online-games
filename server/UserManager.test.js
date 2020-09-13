const UserManager = require('./UserManager')
const { NicknameTakenError } = require('./Errors')
const users = [
  { socketID: 1, nickname: 'alvin' },
  { socketID: 2, nickname: 'teddy' }
]

test('addUser when nickname already exists', () => {
  const manager = new UserManager()

  manager.addUser(1, 'alvin')
  expect(() => manager.addUser(2, 'alvin')).toThrowError(NicknameTakenError)
})

test('addUser when success', () => {
  const manager = new UserManager()

  for (let u of users) {
    const user = manager.addUser(u.socketID, u.nickname)
    expect(user).toEqual({
      socketID: u.socketID,
      nickname: u.nickname,
      color: expect.any(String)
    })

    expect(manager.getUser(user.socketID)).toEqual(user)
  }

  expect(manager.nicknamesSet.size).toEqual(2)
  expect(manager.colorsSet.size).toEqual(2)
})

test('removeUser when socketID is invalid', () => {
  const manager = new UserManager()

  expect(() => manager.removeUser(1)).toThrow('Invalid socketID')
})

test('removeUser when success', () => {
  const manager = new UserManager()

  for (let u of users)
    manager.addUser(u.socketID, u.nickname)

  for (let u of users) {
    const user = manager.removeUser(u.socketID)
    expect(user).toEqual({
      socketID: u.socketID,
      nickname: u.nickname,
      color: expect.any(String)
    })

    expect(() => manager.getUser(user.socketID)).toThrow('Invalid socketID')
  }

  expect(manager.nicknamesSet.size).toEqual(0)
  expect(manager.colorsSet.size).toEqual(0)
})

test('getUsers', () => {
  const manager = new UserManager()

  for (let u of users)
    manager.addUser(u.socketID, u.nickname)

  //sort the result in increasing order of socketID
  const result = manager.getUsers().sort((a, b) => a.socketID - b.socketID)

  expect(result.length).toEqual(2)
  for (let i = 0; i < 2; i++) {
    expect(result[i]).toEqual({
      socketID: users[i].socketID,
      nickname: users[i].nickname,
      color: expect.any(String)
    })
  }
})
