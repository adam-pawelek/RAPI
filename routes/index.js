const pingRoutes = require('./ping/handler')

const createImageRoutes = require('./image/create')
const findImageRoutes = require('./image/find')
const removeImageRoutes = require('./image/remove')
const reportImageRoutes = require('./image/report')

const createFavoriteRoutes = require('./favorites/create')
const getFavoritesRoutes = require('./favorites/find')

const createAndFindCommentRoutes = require('./comment/create')
const editCommentRoutes = require('./comment/edit')
const deleteCommentRoutes = require('./comment/remove')

const authRoutes = require('./auth/handler')

const adminRoutes = require('./user/admin')
const listUserData = require('./user/me')

// This must return an array
module.exports = [
  // ... unwraps the array of routes from the imported modules
  ...pingRoutes,

  ...createImageRoutes,
  ...findImageRoutes,
  ...removeImageRoutes,
  ...reportImageRoutes,

  ...createFavoriteRoutes,
  ...getFavoritesRoutes,

  ...createAndFindCommentRoutes,
  ...editCommentRoutes,
  ...deleteCommentRoutes,

  ...authRoutes,

  ...adminRoutes,
  ...listUserData
]
