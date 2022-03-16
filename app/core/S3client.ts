import { S3 } from "@aws-sdk/client-s3"

const options = {
  endpoint: "https://sgp1.digitaloceanspaces.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
}

console.log(options)
export const s3Client = new S3(options)