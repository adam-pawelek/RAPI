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
      },
      auth: {
        scope: ['admin', 'user']
      }
    },
    handler: async function (request, h) {
      try {
        let deleted = null

        if (request.auth.credentials.model.dataValues.scope === 'admin') {
          deleted = await Comment.destroy({ where: { id: request.params.id } })
        }

        if (request.auth.credentials.model.dataValues.scope === 'user') {
          const userID = request.auth.credentials.user.id
          const comment = await Comment.findOne({ where: { id: request.params.id } })

          if (comment.userId === userID)
            deleted = await Comment.destroy({ where: { id: request.params.id } })
        }
        if (deleted) {
          return h.response('Comment deleted successfully').code(200)
        } else {
          throw new Error('Comment not found')
        }
      } catch (err) {
        console.error(err.message)
      }
    }

  }
]
