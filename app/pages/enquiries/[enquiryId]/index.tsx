import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import {
  Avatar,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { Divider } from "antd"
import Overview from "app/enquiries/components/Overview"
import Log from "app/logs/components/log"
import Document from "app/documents/components/documents"
import CaseStatus from "app/case-statuses/components/CaseStatus"
import ProjectReport from "app/project-reports/components/ProjectReport"
import SearchValuationReport from "app/search-valuation-reports/components/SeachValuationReport"
import SanctionDisbursment from "app/sanction-disbursments/components/SanctionDisbursment"
import BankQuery from "app/bank-queries/components/BankQuery"
import Teasers from "app/teasers/components/Teasers"
import Loading from "app/core/components/Loading"
import getEnquiry from "app/enquiries/queries/getEnquiry"

export const Enquiry = () => {
  const enquiryId = useParam("enquiryId", "number")
  const [enquiry, { refetch }] = useQuery(getEnquiry, { id: enquiryId })
  const TabData = [
    {
      name: "Overview",
      components: Overview,
    },
    {
      name: "Teaser",
      components: Teasers,
    },
    {
      name: "Logs",
      components: Log,
    },
    {
      name: "Document",
      components: Document,
    },
    {
      name: "Project Report",
      components: ProjectReport,
    },
    {
      name: "Bank finalization",
      components: CaseStatus,
    },
    {
      name: "Search & Valuation Report",
      components: SearchValuationReport,
    },
    {
      name: "Bank Queries",
      components: BankQuery,
    },
    {
      name: "Sanction & Disbursment",
      components: SanctionDisbursment,
    },
  ].slice(0, enquiry.enquiry_request === "APPROVED" ? 9 : 1)

  return (
    <>
      <Head>
        <title>Enquiry </title>
      </Head>

      <div className="flex space-x-2 items-center"></div>
      <Divider />
      <Tabs colorScheme="green" isLazy variant="enclosed">
        <div className="overflow-scroll md:overflow-auto p-2">
          <TabList bg="white">
            {TabData.map((item) => (
              <Tab key={item.name}>
                <Text fontWeight="medium" fontSize="sm" className="whitespace-nowrap">
                  {item.name}
                </Text>
              </Tab>
            ))}
          </TabList>
        </div>

        <TabPanels>
          {TabData.map((item) => (
            <TabPanel key={item.name}>
              <Suspense fallback={<Loading />}>
                <item.components />
              </Suspense>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  )
}

const ShowEnquiryPage: BlitzPage = () => {
  return (
    <div>
      <Enquiry />
    </div>
  )
}

ShowEnquiryPage.authenticate = { redirectTo: Routes.LoginPage() }
ShowEnquiryPage.getLayout = (page) => <Layout layout="DashboardLayout">{page}</Layout>

export default ShowEnquiryPage
