const { Image } = require('../../database')

module.exports = [
  {
    method: 'POST',
    path: '/image',
    handler: function (request, h) {
      return Image.create({
        filename: `image-${new Date().toDateString()}`
      })
    }
  }
]
