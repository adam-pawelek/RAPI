module.exports = [
  {
    method: 'GET',
    path: '/ping',
    options: {
      auth: false
    },
    handler: function (request, h) {
      // Just an empty response with status 200 OK
      return h.response('Hello from ping').code(200)
    }
  }
]
