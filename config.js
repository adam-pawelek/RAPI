module.exports = {
  jwt_secret: process.env.JWT_SECRET || 'sshhh',
  database_host:  process.env.DB_HOST || '195.148.22.201',
  database_port: process.env.DB_PORT || 5430,
  database_user:  process.env.DB_USER || 'monkey_user', // Todo: Why did he delete the credentials? should we too?
  database_pass: process.env.DB_PASS || 'monkey_pass',
  database_db: process.env.DB_DB || 'monkey_db',
  bucketname: process.env.BUCKET || 'imager',
  //Github requires a 32 character long secret, so this is a random generated secret to meet the requirement
  github_secret: 'UwtWxrAszEB32RrQJ52byASWVxfxq9sP',
  redis_port: '6379',
  redis_address: '195.148.22.201'
}

