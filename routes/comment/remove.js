const { Comment } = require('../../database')
const { User } =require('../../database')
const Joi = require('joi')

module.exports = [
  {
    method: 'DELETE',
    path: '/comment/{id}',
    options: {
      validate: {
        query: Joi.object({
          id: Joi.string().guid({ version: ['uuidv4'] })
        })
      }
    },
    handler: async function (request, h) {
      try {
        let scope = request.auth.credentials.model.dataValues.scope
        let deleted = null
        console.log(scope)
        if (scope === 'admin') {
          deleted = await Comment.destroy({ where: { id: request.params.id } })
        }
        if (scope === 'user') {
          const userComments = request.auth.credentials.model
          // console.log(userComments.getComments({ where: { id: request.params.id }}))
          if (userComments.getComments({ where: {id: request.params.id}})) {
            deleted = await Comment.destroy({ where: { id: request.params.id } })
          }
        }
        if (deleted) {
          return h.response('Comment deleted successfully').code(200)
        } else {
          throw new Error('comment not found')
        }
      } catch (err) {
        console.error(err.message)
      }
    }

  }
]
