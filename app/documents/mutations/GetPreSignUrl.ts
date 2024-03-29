import { resolver } from "blitz"
import { z } from "zod"
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3Client } from "app/core/S3client"

const CreateDocument = z.object({
  key: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateDocument),
  resolver.authorize(),
  async (input, ctx) => {
    const bucketParams: PutObjectCommandInput = {
      Bucket: "kredpartner",
      Key: input.key,
      ContentType: "application/pdf",
    }

    try {
      const url = await getSignedUrl(s3Client, new PutObjectCommand(bucketParams), {
        expiresIn: 5 * 60,
      })
      return url
    } catch (err) {
      console.log("Error", err)
    }
  }
)
