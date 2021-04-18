const { Comment } = require('../../database')

module.exports = [
  {
    //Changes comment text for one comment to another text from payload
    method: 'PUT',
    path: '/comment/{commentId}',
    options: {
      auth: {
        scope: ['admin', 'user']
      }
    },
    handler: async function (request, h) {

      let updated = null

      if (request.auth.credentials.model.dataValues.scope === 'admin') {
        updated = await Comment.update(
          { comment: request.payload.comment },
          { where: { id: request.params.commentId } }
        );
      }
      if (request.auth.credentials.model.dataValues.scope === 'user') {
        const userId = request.auth.credentials.user.id
        const comment = Comment.findOne({ where: { id: request.params.commentId } })
        if (comment.userId === userId)
          updated = await Comment.update(
            { comment: request.payload.comment },
            { where: { id: request.params.commentId } }
          )
      }
      if (updated) {
        return Comment.findOne({
          where: {
            id: request.params.commentId
          }
        })
      } else throw new Error('Comment not found or it doesn\'t belong to you')
    }
  }
]
