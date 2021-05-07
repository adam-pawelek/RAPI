const { sequelize, User } = require('./database')
const Config = require('./config')
const Routes = require('./routes')

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const Bell = require('@hapi/bell')
const ReqUser = require('hapi-request-user')
const { redisClient } = require('./utils/redis')
const Graylog = require('hapi-graylog')


// Create a server with a host and port
const server = Hapi.server({
  host: '0.0.0.0',
  port: 8000
})

// Wrapper function for the server start
const start = async function () {
  try {
    // Register plugins to server
    await server.register([{
      plugin: Jwt,
      options: {}
    }, {
      plugin: Bell,
      options: {}
    }, {
      plugin: ReqUser,
      options: {}
    }, {
      plugin: Graylog,
      options: {
        host: Config.graylog_host,
        port: Config.graylog_port,
        config: { MAX_BUFFER_SIZE: 700 }
      }
    }
    ])

    // Define a authentication strategies
    server.auth.strategy('jwt_strategy', 'jwt', {
      keys: Config.jwt_secret,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        nbf: false,
        exp: false,
        //Commented because we are using const variables in POSTMAN
        //maxAgeSec: 14400, // 4 hours
        timeSkewSec: 15
      },
      validate: async (artifacts, request, h) => {
        let authBearer = request.headers.authorization.split(' ')
        let authToken = authBearer[1]

        let value = await redisClient.get(authToken)
        if(value === 'logged-out'){
          request.log('info',)
          return {isValid: false}
        }

        return {
          isValid: true,
          credentials: {
            user: artifacts.decoded.payload.user,
            scope: artifacts.decoded.payload.scope,
            // If we are a valid user, fetch the users model from database
            // This makes it easy for us the interact with it later
            model: await User.findByPk(artifacts.decoded.payload.user.id)
          }
        }
      }
    }),

    server.auth.strategy('github', 'bell', {
      provider: 'github',
      password: Config.github_secret,
      isSecure: false,
      clientId: '27aa3e25083c81cf10bb',
      clientSecret: 'f70ab436c2a6abc808d09960cb8273e322f9419b'
    })

    // Set the default auth strategy
    server.auth.default('jwt_strategy')

    // Add the routes
    server.route(Routes)

    await server.start()
    await sequelize.sync({ force: false }) // force: true = recreates the database on each startup
    console.log('Connection has been established successfully.')
  } catch (err) {
    console.log(err)
    process.exit(1)
  }

  console.log('Server running at:', server.info.uri)
  server.log('info', {server_message: 'Server running at' + server.info.uri})
}

start()
