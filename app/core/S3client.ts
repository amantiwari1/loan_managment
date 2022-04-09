import { S3, S3ClientConfig } from "@aws-sdk/client-s3"

const options: S3ClientConfig = {
  endpoint: "https://sgp1.digitaloceanspaces.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
}

export const s3Client = new S3(options)
