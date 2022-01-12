import { Enquiry } from "@prisma/client"
import { Card } from "antd"
import React from "react"
import { useParam, useQuery, useSession } from "blitz"
import getLogs from "../queries/getLogs"
import { Timeline } from "antd"
import getEnquiry from "app/enquiries/queries/getEnquiry"

const TimelineColor = {
  CREATED: "green",
  DELETED: "red",
  UPDATED: "blue",
}

const Log = () => {
  const enquiryId = useParam("enquiryId", "number")
  const [enquiry] = useQuery(getEnquiry, { id: enquiryId })
  const [data] = useQuery(getLogs, {
    where: {
      enquiryId: enquiry.id,
    },
  })
  return (
    <div>
      <Card title="Enquiry Logs">
        <Timeline>
          {data.logs
            .slice(0)
            .reverse()
            .map((item) => (
              <Timeline.Item color={TimelineColor[item.type]} key={item.id}>
                {item.name} {item.User?.name} - {new Date(item.createdAt).toLocaleString()}
              </Timeline.Item>
            ))}
        </Timeline>
      </Card>
    </div>
  )
}

export default Log
