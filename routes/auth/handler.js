const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const config = require('../../config')
const { User } = require('../../database')

module.exports = [
  {
    method: 'POST',
    path: '/auth/register',
    options: {
      auth: false
    },
    handler: async function (request, h) {
      const newUser = await User.create({
        username: request.payload.username,
        password: bcrypt.hashSync(request.payload.password, 10),
        role: request.payload.role
      })

      return User.findOne({
        attributes: ['id', 'username', 'role'],
        where: {
          id: newUser.id
        }
      })
    }
  },
  {
    method: 'POST',
    path: '/auth/login',
    options: {
      auth: false
    },
    handler: async function (request, h) {
      try {
        const user = await User.findOne({
          where: {
            username: request.payload.username
          }
        }, {
          rejectOnEmpty: true
        })

        if (bcrypt.compareSync(request.payload.password, user.password)) {
          const token = jwt.sign({
            user: {
              id: user.id,
              name: user.username
            }
          }, config.jwt_secret)
          return { msg: 'Success', token }
        }

        return { msg: 'Fail' }
      } catch (err) {
        return h.response().code(401)
      }
    }
  }
]
