import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getChannelPartners from "app/channel-partners/queries/getChannelPartners"
import { IconButton, Text } from "@chakra-ui/react"
import { IoMdRefresh } from "react-icons/io"
import Loading from "app/core/components/Loading"
import { toast } from "../_app"
import Table from "app/core/components/Table"

const ITEMS_PER_PAGE = 100

export const ChannelPartnersList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ channelPartners, hasMore }, { refetch }] = usePaginatedQuery(getChannelPartners, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    where: {
      request: "APPROVED",
    },
  })

  const columns = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Company",
      accessor: "company",
    },
    {
      Header: "Phone",
      accessor: "phone",
      render: ({ value }) => <p>{value.toString()}</p>,
    },
    {
      Header: "City",
      accessor: "city",
    },
  ]

  return (
    <div>
      <Table
        title="Channel Partner"
        columns={columns}
        data={channelPartners}
        rightRender={() => (
          <IconButton
            aria-label="Search database"
            onClick={async () => {
              await refetch()
              toast({
                title: "Updated",
                status: "success",
                isClosable: true,
              })
            }}
            variant="outline"
            icon={<IoMdRefresh />}
          />
        )}
      />
    </div>
  )
}

const ChannelPartnersPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>ChannelPartners</title>
      </Head>

      <div>
        <Suspense fallback={<Loading />}>
          <ChannelPartnersList />
        </Suspense>
      </div>
    </>
  )
}

ChannelPartnersPage.authenticate = true
ChannelPartnersPage.getLayout = (page) => <Layout layout="DashboardLayout">{page}</Layout>

export default ChannelPartnersPage
