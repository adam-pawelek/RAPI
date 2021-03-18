const { sequelize } = require('./database')

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

const Routes = require('./routes')

// Create a server with a host and port
const server = Hapi.server({
  host: '0.0.0.0',
  port: 8000
})

// Add the routes
server.route(Routes)

// Wrapper function for the server start
const start = async function () {
  try {
    await server.register(Jwt)
    server.auth.strategy('my_jwt_strategy', 'jwt', {
      keys: 'sshhhhhshshh',
      verify: {
        aud: false,
        iss: false,
        sub: false,
        nbf: false,
        exp: false,
        maxAgeSec: 14400, // 4 hours
        timeSkewSec: 15
      },
      validate: (artifacts, request, h) => {
        return {
          isValid: true,
          credentials: { user: artifacts.decoded.payload.user }
        }
      }
    })

    // Set the strategy

    server.auth.default('my_jwt_strategy')

    await server.start()
    await sequelize.sync({ force: true })
    console.log('Connection has been established successfully.')
  } catch (err) {
    console.log(err)
    process.exit(1)
  }

  console.log('Server running at:', server.info.uri)
}

start()
