const pingRoutes = require('./ping/handler')

const findImageRoutes = require('./image/find')
const createImageRoutes = require('./image/create')

const authRoutes = require('./auth/handler')

module.exports = [
  ...pingRoutes,

  ...findImageRoutes,
  ...createImageRoutes,

  ...authRoutes
]
