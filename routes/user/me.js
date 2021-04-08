const Config = require('../../config')
const { User } = require('../../database')
const jwt = require('jsonwebtoken')

module.exports = [
  {
    method: 'GET',
    path: '/me',
    handler:  async function (request, h) {
      let userToken = await request.headers
      const token = userToken.authorization.split(' ');
      const decoded = jwt.verify(token[1], Config.jwt_secret );

      let user = decoded.user;
      console.log(user.name);

      const me = await User.findAll({
        where: {
          username: user.name
        }
      })

      return { msg: 'Success! This is ME', me }
    }
  }
]


