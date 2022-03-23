import { resolver } from "blitz"
import { z } from "zod"
import { DeleteObjectCommand, DeleteObjectCommandInput } from "@aws-sdk/client-s3"
import { s3Client } from "app/core/S3client"

const CreateDocument = z.object({
  key: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateDocument),
  resolver.authorize(),
  async (input, ctx) => {
    const bucketParams: DeleteObjectCommandInput = {
      Bucket: "kredpartner",
      Key: input.key,
    }

    try {
      const data = await s3Client.send(new DeleteObjectCommand(bucketParams))
      return data
    } catch (err) {
      console.log("Error", err)
    }
  }
)
