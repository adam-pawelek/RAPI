const Config = require('../../config')
const { User } = require('../../database')
const jwt = require('jsonwebtoken')

module.exports = [
  {
    method: 'GET',
    path: '/admin/user',
    auth: {
      scopes: ['admin']
    },
    handler: async function (request, h) {

      const allUsers = await User.findAll()

      return allUsers.map(userList => (
        {
          ...userList.toJSON()
        }
      ))
      //return { msg: 'Success! This is ME', me }
    }
  }
]
