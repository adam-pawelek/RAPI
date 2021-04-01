const { Image } = require('../../database')
const Joi = require('joi')
const Config = require("../../config");
const {removeFileFromBucket} = require("../../utils/minio");

module.exports = [
    {
        method: 'DELETE',
        path: '/image/{id}',
        options: {
            validate: {
                query: Joi.object({
                    id: Joi.string().guid({   version: ['uuidv4']})
                })
            }
        },
        handler: async function (request, h) {
            try {
                let id = request.params.id;
                const deleted = await Image.destroy({ where: { id: id } });
                if ( deleted) {
                    return h.response('image deleted successfully').code(200)
                } else {
                    throw new Error('Image not found');
                }
            } catch (error) {
                return h.response(" Error "+error.message).code(500)
            }
        }
    },
    {
        method: 'DELETE',
        path: '/image/minio/{filename}',
        handler: function (request, h) {
           return  removeFileFromBucket(Config.bucketname, request.params.filename);
        }
    }
]
