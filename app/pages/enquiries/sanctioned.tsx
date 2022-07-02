import { BlitzPage, Routes, usePaginatedQuery, useRouter, useSession } from "blitz"
import Layout from "app/core/layouts/Layout"
import getEnquiries from "app/enquiries/queries/getEnquiries"
import { Suspense } from "react"
import Loading from "app/core/components/Loading"
import Table, { NumberCell, DateCell, ClientNameCell } from "app/core/components/Table"
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<any>[] = [
  {
    header: "Client Name",
    accessorKey: "client_name",
    cell: ClientNameCell,
  },
  {
    header: "Amount",
    accessorKey: "loan_amount",
    id: "loan_amount",
    cell: NumberCell,
  },
  {
    header: "Last Updated",
    accessorKey: "updatedAt",
    id: "updatedAt",
    cell: DateCell,
  },
]

export const EnquiriesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const search = (router.query.search as string) || ""
  const take = Number(router.query.take) || 10
  const [{ enquiries, hasMore, count }] = usePaginatedQuery(getEnquiries, {
    orderBy: { id: "asc" },
    skip: take * page,
    take: take,
    where: {
      client_name: {
        contains: search.toLowerCase(),
        mode: "insensitive",
      },
      enquiry_request: "SANCTIONED",
    },
  })

  const session = useSession()

  return (
    <div>
      {!["USER", "PARTNER"].includes(session.role as string) && <div></div>}
      <Table
        count={count}
        hasMore={hasMore}
        columns={columns}
        data={enquiries}
        title="Sanctioned Enquiries"
      />
    </div>
  )
}

const EnquirySanctionedPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <EnquiriesList />
      </Suspense>
    </div>
  )
}

EnquirySanctionedPage.getLayout = (page) => (
  <Layout layout="DashboardLayout" title="Enquiries Request">
    {page}
  </Layout>
)
EnquirySanctionedPage.authenticate = { redirectTo: Routes.LoginPage() }

export default EnquirySanctionedPage
