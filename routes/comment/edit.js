const { Comment } = require('../../database')

module.exports = [
  {
    //Changes comment text for one comment to another text from payload
    method: 'PUT',
    path: '/comment/{commentId}',
    handler: async function (request, h) {
      await Comment.update(
        { comment: request.payload.comment },
        { where: { id: request.params.commentId } }
        );
      return Comment.findOne({
        where: {
          id: request.params.commentId
        }
      })
    }
  }
]
