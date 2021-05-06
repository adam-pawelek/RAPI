const JWT = require('jsonwebtoken')
const config = require('../../config')
const Redis = require('./redis')
const Crypto = require('crypto')

class JsonWebToken {
  constructor () {
    this.secret = config.jwt_secret
  }

  async create (payload) {
    return JWT.sign(payload, this.secret, {
      jwtid: await this.getJwtId()
    })
  }

  async getJwtId () {
    let jti = this.generateTokenIdentifier()

    while (await this.isTokenIdentifierTaken(jti)) {
      jti = this.generateTokenIdentifier()
    }

    await this.storeTokenIdentifier(jti)

    return jti
  }

  generateTokenIdentifier() {
    return Crypto.randomBytes(10).toString('hex')
  }

  async isTokenIdentifierTaken(jti) {
    const jwtKey = this.redisJwtIdentifier(jti)
    const blacklistKey = this.redisBlacklistIdentifier(jti)

    return !!(await Redis.get(jwtKey)) || !!(await Redis.get(blacklistKey))
  }

  async storeTokenIdentifier(jti) {
    const key = this.redisJwtIdentifier(jti)

    await Redis.set(key, jti, 'PX')
  }

  redisJwtIdentifier(jti){
    return `jwt:identifier:${jti}`
  }

  redisBlacklistIdentifier(jti){
    return `jwt:blacklisted:${jti}`
  }

  async isBlacklisted({jti} = {}){
    if (!jti) {
      return false
    }

    const key = this.redisBlacklistIdentifier(jti)

    return !!(await Redis.get(key))
  }

  async setBlacklisted ({ jti, exp } = {}) {
    if (!jti) {
      return
    }

    const key = this.redisBlacklistIdentifier(jti)
    await Redis.set(key, 'blacklisted', 'EX')
  }

  /*
  remainingSeconds(expiresIn){
  const now = new Date()
  const nowInSeconds = Math.round(now.getTime() / 1000)

  return expiresIn - nowInSeconds
   */
}
module.exports = new JsonWebToken()
