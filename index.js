const { sequelize, User } = require('./database')
const Config = require('./config')

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

const Routes = require('./routes')

// Create a server with a host and port
const server = Hapi.server({
  host: '0.0.0.0',
  port: 8000
})



// Wrapper function for the server start
const start = async function () {
  try {
    // Define a authentication strategy
    await server.register(Jwt)
    server.auth.strategy('jwt_strategy', 'jwt', {
      keys: Config.jwt_secret,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        nbf: false,
        exp: false,
        maxAgeSec: 14400, // 4 hours
        timeSkewSec: 15
      },
      validate: async (artifacts, request, h) => {
        //const {scope} = await User.findByPk(artifacts.decoded.payload.user.id)
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
}

start()
