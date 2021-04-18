const Config = require('../../config')
const jwt = require('jsonwebtoken')
const {Favorite} = require('../../database')


module.exports = [

    {
        method: 'GET',
            path: '/me/favorites',
        options: {
            auth: {
                scope: ['admin', 'user']
            }
        },
        handler: async function (request, h) {
            try {
                let userToken = await request.headers
                const token = userToken.authorization.split(' ');
                const decoded = jwt.verify(token[1], Config.jwt_secret );

                let user = decoded.user;
                console.log(user.name);

                const favorites = await Favorite.findAll({
                    where: {
                        userId: user.id
                    }
                })

                return {msg: 'Here are all your favorite images '+user.name, favorites}
            } catch (error) {
                return h.response(' Error ' + error.message).code(500)
            }
        }
    }
]
