import { Enquiry } from "@prisma/client"
import { Card, Divider } from "antd"
import React from "react"
import { Text } from "@chakra-ui/react"

const Overview = ({ enquiry }: { enquiry: Enquiry }) => {
  return (
    <div>
      <Card title="Enquiry Overview">
        <Text fontSize="xl">{enquiry.client_name}</Text>
        <Divider />
        <Text fontSize="xl">{enquiry.client_mobile.toString()}</Text>
        <Divider />
        <Text fontSize="xl">{enquiry.client_address}</Text>
        <Divider />
        <Text fontSize="xl">{enquiry.client_qccupation_type}</Text>
        <Divider />
        <Text fontSize="xl">{enquiry.client_service}</Text>
        <Divider />
        {/* <p>{enquiry.reatedAt}</p> */}
        <Text fontSize="xl">{enquiry.loan_amount.toString()}</Text>
        <Divider />
        <Text fontSize="xl">{enquiry.private_enquiry}</Text>
      </Card>
    </div>
  )
}

export default Overview
