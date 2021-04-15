const { Comment } = require('../../database')

module.exports = [
  {
    method: 'POST',
    path: '/image/{image_id}/comment',
    handler: function (request, h) {

      return Comment.create({
        comment: request.payload.comment,
        image_id: request.params.image_id
      })
    }
  },
  {
    method: 'GET',
    path: '/comments',
    handler: async function (request, h) {
      comments = await Comment.findAll();
      return comments.map (comment => (
        {
          ...comment.toJSON()
        }))
    }
  }
]
