module.exports = {
  jwt_secret: process.env.JWT_SECRET || 'sshhh',
  database_host:  process.env.DB_HOST || '195.148.22.201',
  database_port: process.env.DB_PORT || 5430,
  database_user:  process.env.DB_USER || 'monkey_user', // Todo: Why did he delete the credentials? should we too?
  database_pass: process.env.DB_PASS || 'monkey_pass',
  database_db: process.env.DB_DB || 'monkey_db',
  bucketname: process.env.BUCKET || 'imager',
  github_secret: 'ssshh'
}

