import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getChannelPartners from "app/channel-partners/queries/getChannelPartners"
import { message, Table } from "antd"
import { IconButton, Text } from "@chakra-ui/react"
import { IoMdRefresh } from "react-icons/io"

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

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => <p>{name}</p>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (name) => <p>{name}</p>,
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (name) => <p>{name}</p>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (name) => <p>{name.toString()}</p>,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      render: (name) => <p>{name}</p>,
    },
  ]

  return (
    <div>
      <Table
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={channelPartners}
        bordered
        title={() => (
          <div className="space-y-1 md:flex md:justify-between">
            <Text fontWeight="bold">Channel Partner</Text>
            <IconButton
              aria-label="Search database"
              onClick={async () => {
                await refetch()
                message.success("Updated")
              }}
              variant="outline"
              icon={<IoMdRefresh />}
            />
          </div>
        )}
      />

      {/* <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button> */}
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
        <Suspense fallback={<div>Loading...</div>}>
          <ChannelPartnersList />
        </Suspense>
      </div>
    </>
  )
}

ChannelPartnersPage.authenticate = true
ChannelPartnersPage.getLayout = (page) => <Layout layout="DashboardLayout">{page}</Layout>

export default ChannelPartnersPage
