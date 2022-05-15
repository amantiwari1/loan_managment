import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getChannelPartners from "app/channel-partners/queries/getChannelPartners"
import { IconButton, Text } from "@chakra-ui/react"
import { IoMdRefresh } from "react-icons/io"
import Loading from "app/core/components/Loading"
import { toast } from "../_app"
import Table from "app/core/components/Table"

export const ChannelPartnersList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const search = (router.query.search as string) || ""
  const take = Number(router.query.take) || 10
  const [{ channelPartners, hasMore, count }, { refetch }] = usePaginatedQuery(getChannelPartners, {
    orderBy: { id: "asc" },
    skip: take * page,
    take: take,
    where: {
      name: {
        contains: search.toLowerCase(),
        mode: "insensitive",
      },
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
        count={count}
        hasMore={hasMore}
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
