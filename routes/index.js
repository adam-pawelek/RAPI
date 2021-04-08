const pingRoutes = require('./ping/handler')

const createImageRoutes = require('./image/create')
const findImageRoutes = require('./image/find')
const removeImageRoutes = require('./image/remove')
const reportImageRoutes = require('./image/report')

const authRoutes = require('./auth/handler')

const listUserData = require('./user/me')

// This must return an array
module.exports = [
  // ... unwraps the array of routes from the imported modules
  ...pingRoutes,

  ...createImageRoutes,
  ...findImageRoutes,
  ...removeImageRoutes,
  ...reportImageRoutes,

  ...authRoutes,

  ...listUserData
]
