const Config = require("../../config")
const jwt = require('jsonwebtoken')
const {Favorite} = require("../../database")
const Joi = require('joi')

module.exports = [
    {
        method: 'POST',
        path: '/image/{id}/favorite',
        options: {
            validate: {
                query: Joi.object({
                    id: Joi.string().guid({ version: ['uuidv4'] })
                })
            }
        },
        handler: async function (request, h) {
            try {
                let imageId =  request.params.id;

                let userToken = await request.headers
                const token = userToken.authorization.split(' ')
                const decoded = jwt.verify(token[1], Config.jwt_secret)

                let user = decoded.user
    // todo: check if it already exists in favs for this user
                // plus: if image exists add all
                console.log("imageid  "+imageId);
                console.log("user id "+user.id);

                // // check if image exists
                // const image = await Image.findOne({
                //     where: {
                //         id: imageId
                //     }
                // }).then((result)=>{
                //     if(result.empty){
                //         console.log('Error Image does not exist');
                //     }
                // })

                const favorite = await Favorite.create({
                    imageId: imageId,
                    userId: user.id
                })

                return  {msg: 'Success! The following image was added to you favorites.', favorite}
            } catch (error) {
                return h.response(' Error: ' + error.message).code(error.code)
            }
        }
    }
    ]
