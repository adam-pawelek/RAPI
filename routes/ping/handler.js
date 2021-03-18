module.exports = [
  {
    method: 'GET',
    path: '/ping',
    handler: function (request, h) {
      return h.response().code(200)
    }
  }
]
