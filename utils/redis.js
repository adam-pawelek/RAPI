const IoRedis = require('ioredis')

class Redis {
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
