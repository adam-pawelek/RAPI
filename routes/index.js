const pingRoutes = require('./ping/handler')

const createImageRoutes = require('./image/create')
const findImageRoutes = require('./image/find')
const removeImageRoutes = require('./image/remove')

const authRoutes = require('./auth/handler')

// This must return an array
module.exports = [
  // ... unwraps the array of routes from the imported modules
  ...pingRoutes,

  ...createImageRoutes,
  ...findImageRoutes,
  ...removeImageRoutes,

  ...authRoutes
]
