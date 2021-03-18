const { Image } = require('../../database')

module.exports = [
  {
    method: 'GET',
    path: '/image',
    handler: function (request, h) {
      return Image.findAll()
    }
  }
]
