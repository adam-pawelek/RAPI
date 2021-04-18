const Config = require("../../config")
const jwt = require('jsonwebtoken')
const {Favorite} = require("../../database")
const Joi = require('joi')
const Boom = require('@hapi/boom')

module.exports = [
    {
        method: 'Delete',
        path: '/image/{id}/favorite',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            validate: {
                query: Joi.object({
                    id: Joi.string().guid({ version: ['uuidv4'] })
                })
            }
        },
        handler: async function (request) {
            let imageId =  request.params.id;
            let deleted;

            let userToken = await request.headers
            const token = userToken.authorization.split(' ')
            const decoded = jwt.verify(token[1], Config.jwt_secret)

            let user = decoded.user

            // check if image is favorite of this user
            let favorite = await    Favorite.findOne({
                where: {
                    imageId: imageId,
                    userId: user.id
                }
            })

            if(favorite===null)
            {
                let error = new Error('Image was not on your list of favorites, please check id '+ imageId)
                throw Boom.boomify(error, { statusCode: 404});
            }

            deleted = await Favorite.destroy({
                    where: {
                        imageId: imageId,
                        userId: user.id
                    }
                })

            if (deleted) {
                return  {msg: "Success: Image with this id was removed from your favorites: "+ imageId}
            } else {
                let error = new Error('Favorite could not be deleted for Image '+ imageId)
                throw Boom.boomify(error, { statusCode: 500})
            }
        }
    }
]
