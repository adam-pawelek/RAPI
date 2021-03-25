const Minio = require('minio')
const config = require('../config')

// Create our client to connect to minio / S3
// https://docs.min.io/docs/javascript-client-api-reference.html
const minioClient = new Minio.Client({
  // TODO: Maybe move these to config?
  endPoint: 'minio.imager.local',
  port: 80,
  useSSL: false,
  accessKey: 'minio',
  secretKey: 'minio123'
})

// Just constant for easier access to bucketname
const imagerBucketName = config.bucketname

const listBucketFiles = (bucketname) => {
  return new Promise((resolve, reject) => {
    const files = []
    const stream = minioClient.listObjectsV2(bucketname, '', true)
    // Push recieved file objects to array
    stream.on('data', (obj) => { files.push(obj) })
    // Resolve after all data recieved
    stream.on('end', () => { resolve(files) })
    // Reject on error
    stream.on('error', (err) => { reject(err) })
  })
}

// Initialization fuction to setup our environemnt
const setupMinio = async () => {
  try {
    // Check if the bucket exists
    const bucketExists = await minioClient.bucketExists(imagerBucketName)
    if (bucketExists) {
      console.log(`Bucket: ${imagerBucketName} already exists!`)
      return
    }

    // Create a new bucket
    await minioClient.makeBucket(imagerBucketName)

    // Set policy to allow anonymous access
    // Policies: https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html
    const ourPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicRead',
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject', 's3:GetObjectVersion'],
          Resource: [`arn:aws:s3:::${imagerBucketName}/*`]
        }
      ]
    }
    await minioClient.setBucketPolicy(imagerBucketName, JSON.stringify(ourPolicy))
  } catch (error) {
    console.error(error)
  }
}

// Run the setup every time app starts
setupMinio()

module.exports = {
  listBucketFiles,
  minioClient
}
