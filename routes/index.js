const pingRoutes = require('./ping/handler')

const findImageRoutes = require('./image/find')
const createImageRoutes = require('./image/create')

const authRoutes = require('./auth/handler')

// This must return an array
module.exports = [
  // ... unwraps the array of routes from the imported modules
  ...pingRoutes,

  ...findImageRoutes,
  ...createImageRoutes,

  ...authRoutes
]
