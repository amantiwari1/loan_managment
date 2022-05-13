import React from "react"
import { useParam, useQuery } from "blitz"
import getLogs from "../queries/getLogs"
import getEnquiry from "app/enquiries/queries/getEnquiry"
import { Box, Heading } from "@chakra-ui/react"

const TimelineColor = {
  CREATED: "green",
  DELETED: "red",
  UPDATED: "blue",
}

const Log = () => {
  const enquiryId = useParam("enquiryId", "number")
  const [enquiry] = useQuery(
    getEnquiry,
    { id: enquiryId },
    {
      refetchOnWindowFocus: false,
    }
  )
  const [data] = useQuery(getLogs, {
    where: {
      enquiryId: enquiry.id,
    },
  })
  return (
    <div>
      <Box backgroundColor="white" p={5}>
        <Heading as="h4" size="md">
          Enquiry logs
        </Heading>

        <div>
          {data.logs
            .slice(0)
            .reverse()
            .map((item) => (
              <Box key={item.id} my={2} color={TimelineColor[item.type]}>
                {item.name} {item.User?.name} - {new Date(item.createdAt).toLocaleString()}
              </Box>
            ))}
        </div>
      </Box>
    </div>
  )
}

export default Log
