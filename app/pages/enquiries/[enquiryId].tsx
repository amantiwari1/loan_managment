import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getEnquiry from "app/enquiries/queries/getEnquiry"
import deleteEnquiry from "app/enquiries/mutations/deleteEnquiry"
import { Avatar, Tab, Tabs, TabList, TabPanel, TabPanels } from "@chakra-ui/react"
import { Divider } from "antd"
import Overview from "app/enquiries/components/Overview"
import Log from "app/logs/components/log"
import Document from "app/documents/components/documents"
import CaseStatus from "app/case-statuses/components/CaseStatus"
import ProjectReport from "app/project-reports/components/ProjectReport"
import { SearchValuationReportForm } from "app/search-valuation-reports/components/SearchValuationReportForm"
import SearchValuationReport from "app/search-valuation-reports/components/SeachValuationReport"
import BankQuery from "app/bank-queries/components/bankQuery"
import SanctionDisbursment from "app/sanction-disbursments/components/SanctionDisbursment"
export const Enquiry = () => {
  const router = useRouter()
  const enquiryId = useParam("enquiryId", "number")
  const [deleteEnquiryMutation] = useMutation(deleteEnquiry)
  const [enquiry] = useQuery(getEnquiry, { id: enquiryId })

  const TabData = [
    {
      name: "Overview",
      components: <Overview enquiry={enquiry} />,
    },
    {
      name: "Teaser",
      components: <a>Hello</a>,
    },
    {
      name: "Logs",
      components: <Log enquiry={enquiry} />,
    },
    {
      name: "Document",
      components: <Document enquiry={enquiry} />,
    },
    {
      name: "Project Report",
      components: <ProjectReport enquiry={enquiry} />,
    },
    {
      name: "Case Status",
      components: <CaseStatus enquiry={enquiry} />,
    },
    {
      name: "Search & Valuation Report",
      components: <SearchValuationReport enquiry={enquiry} />,
    },
    {
      name: "Bank Queries",
      components: <BankQuery enquiry={enquiry} />,
    },
    {
      name: "Sanction & Disbursment",
      components: <SanctionDisbursment enquiry={enquiry} />,
    },
  ]

  return (
    <>
      <Head>
        <title>Enquiry {enquiry.id}</title>
      </Head>

      <div className="flex space-x-2 items-center">
        <Avatar size="md" name={enquiry.client_name} />
        <h1 className="text-2xl capitalize">{enquiry.client_name}</h1>
      </div>
      <Divider />
      <Tabs>
        <TabList bg="white">
          {TabData.map((item) => (
            <Tab key={item.name}>{item.name}</Tab>
          ))}
        </TabList>

        <TabPanels>
          {TabData.map((item) => (
            <TabPanel key={item.name}>{item.components}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  )
}

const ShowEnquiryPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Enquiry />
      </Suspense>
    </div>
  )
}

ShowEnquiryPage.authenticate = true
ShowEnquiryPage.getLayout = (page) => <Layout layout="DashboardLayout">{page}</Layout>

export default ShowEnquiryPage
