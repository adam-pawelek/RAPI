const { User } = require('../../database')
const { Notice } = require('../../database')

module.exports = [
  {
    method: 'GET',
    path: '/admin/user',
    config: {
      auth:  {
        strategy: 'jwt_strategy',
        scope: User.scope = 'admin'
      }
      ,
      handler: async function (request, h) {

        const allUsers = await User.findAll()

        return allUsers.map(userList => (
          {
            ...userList.toJSON()
          }
        ))
      }
    }
  },
  {
    method: 'GET',
    path: '/admin/notice',
    config: {
      auth:  {
        strategy: 'jwt_strategy',
        scope: User.scope = 'admin'
      }
      ,
      handler: async function (request, h) {

        const allNotices = await Notice.findAll()

        return allNotices.map(noticeList => (
          {
            ...noticeList.toJSON()
          }
        ))
      }
    }
  }
]
