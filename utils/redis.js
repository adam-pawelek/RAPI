//const IoRedis = require('ioredis')
const redis = require('redis')
const asyncRedis = require('async-redis')
const config = require('../config')

syncRedisClient = redis.createClient(config.redis_port, config.redis_address)
redisClient = asyncRedis.decorate(syncRedisClient)

module.exports = {
  redisClient,
  redis
}


/*class Redis {
  constructor () {
    this.config = {
      //Redis config still needs to go here
    }

    this.client = new IoRedis(this.config)

    this.client.on('error', err => {
      console.error(`Redis error ${err.message}`)
    })
   return this.client
  }
}
module.exports = new Redis()
*/

