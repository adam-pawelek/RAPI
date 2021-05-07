module.exports = {
  jwt_secret: process.env.JWT_SECRET || 'sshhh',
  database_host:  process.env.DB_HOST || '195.148.22.201',
  database_port: process.env.DB_PORT || 5430,
  database_user:  process.env.DB_USER || 'monkey_user', // Todo: Why did he delete the credentials? should we too?
  database_pass: process.env.DB_PASS || 'monkey_pass',
  database_db: process.env.DB_DB || 'monkey_db',
  bucketname: process.env.BUCKET || 'imager',
  minio_accesskey: process.env.MINIO_ACCESS || 'minio',
  minio_password: process.env.MINIO_PASS || 'minio123',
  minio_endpoint: process.env.MINIO_ENDPOINT || 'minio.imager.local',
  minio_port: process.env.MINIO_PORT || 80,
  minio_useSSL: process.env.MINIO_SSL || false,
  graylog_host: process.env.GRAYLOG_ENDPOINT || 'graylog.imager.local',
  graylog_port: 12201,
  //Github requires a 32 character long secret, so this is a random generated secret to meet the requirement
  github_secret: 'UwtWxrAszEB32RrQJ52byASWVxfxq9sP',
  redis_host: '195.148.22.201',
  redis_port: 6379,
}

