import { useRouter, BlitzPage, Routes, useParam, useRouterQuery } from "blitz"
import Layout from "app/core/layouts/Layout"

import { Button } from "app/core/components/Button"
import { Box, Heading } from "@chakra-ui/react"
import { CheckCircleIcon } from "@chakra-ui/icons"
import { toast } from "../_app"

const ResultUserPage: BlitzPage = () => {
  const token = useRouterQuery()

  return (
    <div className="max-w-5xl mx-auto">
      <Box textAlign="center" py={10} px={6}>
        <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
        <Heading as="h2" size="xl" mt={6} mb={2}>
          Successfully Invited User
        </Heading>
        <Button
          key="console"
          onClick={() => {
            navigator.clipboard.writeText(token.token as any).then(() => {
              toast({
                title: "Copied the Invite Link",
                status: "success",
                isClosable: true,
              })
            })
          }}
        >
          Copy Link
        </Button>
      </Box>
    </div>
  )
}

ResultUserPage.authenticate = { redirectTo: Routes.LoginPage() }
ResultUserPage.getLayout = (page) => (
  <Layout layout="DashboardLayout" title={"Create New User"}>
    {page}
  </Layout>
)

export default ResultUserPage
