import { resolver } from "blitz"
import { z } from "zod"
import { GetObjectCommand, GetObjectCommandInput } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3Client } from "app/core/S3client"

const CreateDocument = z.object({
  key: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateDocument),
  resolver.authorize(),
  async (input, ctx) => {
    const bucketParams: GetObjectCommandInput = {
      Bucket: "kredpartner",
      Key: input.key,
    }

    try {
      const url = await getSignedUrl(s3Client, new GetObjectCommand(bucketParams), {
        expiresIn: 5 * 60,
      })
      return url
    } catch (err) {
      console.log("Error", err)
    }
  }
)
