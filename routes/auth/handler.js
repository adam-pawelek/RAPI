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
        scope: request.payload.scope
      })

      return User.findOne({
        attributes: ['id', 'username', 'scope'],
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
            },
            scope: [user.scope]
          }, config.jwt_secret)



          return { msg: 'Success', token }
        }

        return { msg: 'Fail' }
      } catch (err) {
        return h.response().code(401)
      }
    }
  },
  {
    method: 'GET',
    path: '/auth/github',
    options: {
      auth: 'github',
    },
    handler: function (request, h) {
      try {
        if (request.auth.isAuthenticated) {
          const user = request.auth.credentials.profile
          const data = {
            name: user.displayName,
            username: user.username
          }

          return h.view('authenticated', data)
        }
      } catch (e) {
          return h.view(e)
      }
    }
  },
  {
    method: 'GET',
    path: '/auth/logout',
    handler: function (request, h) {

    }
  }
]
