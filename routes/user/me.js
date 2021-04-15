
module.exports = [
  {
    method: 'GET',
    path: '/me',
    config: {
      auth: {
        scope: ['admin', 'user']
      },
      handler: async function (request, h) {

        let user = request.auth.credentials.user

        console.log(user.name);

        const me = request.auth.credentials.model

        return {
          msg: 'Success! This is ME',
          me
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/me/image',
    config: {
      auth: {
        scope: ['admin', 'user']
      },
      handler: async function (request, h) {

        const me = request.auth.credentials.model

        const myImages = await me.getImages()

        return {
          msg: 'Success! These are all my posted images',
          myImages
        }
      }
    }
  }
]


