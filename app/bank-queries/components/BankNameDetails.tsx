import { Box, Divider, HStack, Input, Text } from "@chakra-ui/react"
import { useMutation, useParam, useQuery } from "blitz"
import React from "react"
import updateCaseStatus from "../mutations/updateCaseStatusFromBankQuery"
import getBankNameDetails from "../queries/getBankNameDetails"

const BankNameDetails = () => {
  const enquiryId = useParam("enquiryId", "number")

  const [data] = useQuery(getBankNameDetails, {
    enquiryId,
  })

  const [updateCaseStatusMutation] = useMutation(updateCaseStatus)

  return (
    <Box p={5} backgroundColor="white" shadow="sm" rounded="sm">
      <HStack h="50px" spacing={8}>
        <Text>Bank Name: {data ? data.bank_name : "No Selected Bank Name yet"}</Text>
        <Divider orientation="vertical" />
        <Text>Case Status :</Text>
        <Input
          hidden={data ? false : true}
          w={250}
          defaultValue={data?.case_status ?? ""}
          onChange={(e) => {
            updateCaseStatusMutation({
              case_status: e.target.value,
              enquiryId: enquiryId,
              id: data.id,
            })
          }}
        />
      </HStack>
    </Box>
  )
}

export default BankNameDetails
