import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Avatar, Tab, Tabs, TabList, TabPanel, TabPanels, Text } from "@chakra-ui/react"
import { Divider } from "antd"
import Overview from "app/enquiries/components/Overview"
import Log from "app/logs/components/log"
import Document from "app/documents/components/documents"
import CaseStatus from "app/case-statuses/components/CaseStatus"
import ProjectReport from "app/project-reports/components/ProjectReport"
import SearchValuationReport from "app/search-valuation-reports/components/SeachValuationReport"
import SanctionDisbursment from "app/sanction-disbursments/components/SanctionDisbursment"
import BankQuery from "app/bank-queries/components/BankQuery"
export const Enquiry = () => {
  const TabData = [
    {
      name: "Overview",
      components: Overview,
    },
    {
      name: "Teaser",
      components: Overview,
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
      name: "Case Status",
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
  ]

  return (
    <>
      <Head>
        <title>Enquiry </title>
      </Head>

      <div className="flex space-x-2 items-center">
        {/* <Avatar size="md" name={enquiry.client_name} />
        <h1 className="text-2xl capitalize">{enquiry.client_name}</h1> */}
      </div>
      <Divider />
      <Tabs isLazy>
        <TabList bg="white">
          {TabData.map((item) => (
            <Tab key={item.name}>
              <Text fontWeight="medium">{item.name}</Text>
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {TabData.map((item) => (
            <TabPanel key={item.name}>
              <Suspense fallback={<div>Loading....</div>}>
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
