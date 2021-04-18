const Config = require("../../config")
const jwt = require('jsonwebtoken')
const {Favorite} = require("../../database")
const Joi = require('joi')
const { Image } = require('../../database')

const Boom = require('@hapi/boom')


module.exports = [
    {
        method: 'POST',
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
            let message = '';

            let userToken = await request.headers
            const token = userToken.authorization.split(' ')
            const decoded = jwt.verify(token[1], Config.jwt_secret)

            let user = decoded.user

            // check if image exists
            let image = await Image.findOne({where : {id: imageId}});
            if(!image)
            {
                let error = new Error('Image does not exists');
                throw Boom.boomify(error, { statusCode: 404});
            }

            // check if image is already favorite of this user
            await    Favorite.findOne({
            where: {
                imageId: imageId,
                userId: user.id
            }
            }).then(
                value => {
                    if(value!=null)
                    {
                        let error = new Error('You already added this image as a favorite, for Image id '+ imageId)
                        throw Boom.boomify(error, { statusCode: 409})
                    }
                }
            )

            const favorite =
                await Favorite.create({
                imageId: imageId,
                userId: user.id
            }).then((result)=>{
                if(result!=null)
                {
                    message =  'Success! The following image was added to you favorites.';
                    return result;
                } else {
                    message = 'An error occurred';
                }
             })

            return  {msg: message , favorite}
        }
    }
]
