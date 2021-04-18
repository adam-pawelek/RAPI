const { Comment } = require('../../database')
const Joi = require('joi')

module.exports = [
  {
    method: 'POST',
    path: '/image/{imageId}/comment',
    options: {
      auth: {
        strategy: 'jwt_strategy',
        mode: 'try',
      },
      validate: {
        query: Joi.object({
          imageId: Joi.string().guid({ version: ['uuidv4'] })
        })
      }
    },
    handler: async function (request, h) {

      //Check if not anonymous
      if (request.auth.isAuthenticated) {

        const comment = await Comment.create({
          comment: request.payload.comment,
          imageId: request.params.imageId,
          userId: request.auth.credentials.user.id
        })

        console.log('commentID: ', comment.id)
        return Comment.findOne({
          attributes: ['id', 'imageId', 'comment', 'userId'],
          where: {
            id: comment.id
          }
        })
      } else {
        return h.response('Not Authorized').code(401)
      }
    }
  },
  {
    // JUST FOR TESTING
    // SHOULD BE DELETED BEFORE PRODUCTION
    method: 'GET',
    path: '/comments',
    handler: async function (request, h) {
      const comments = await Comment.findAll()
      return comments.map(cmt => (
          {
            ...cmt.toJSON()
          }
        )
      )
    }
  }
]
