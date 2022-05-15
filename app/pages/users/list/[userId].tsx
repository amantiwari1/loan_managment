import { Suspense } from "react"
import { Head, Link, useRouter, useParam, BlitzPage, Routes, usePaginatedQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import getUsers from "app/users/queries/getUsers"
import { Button } from "app/core/components/Button"
import Loading from "app/core/components/Loading"
import Table, { DateCell } from "app/core/components/Table"

const ITEMS_PER_PAGE = 100

const Columns = [
  {
    Header: "createdAt",
    accessor: "createdAt",
    Cell: DateCell,
  },
  {
    Header: "updatedAt",
    accessor: "updatedAt",
    Cell: DateCell,
  },
  {
    Header: "Name",
    accessor: "name",
    Cell: ({ value }) => <p>{value ? value : "No Name"}</p>,
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "id",
    Cell: ({ value }) => (
      <Link href={Routes.EditUserPage({ userId: value })}>
        <a className="text-blue-400"> Edit</a>
      </Link>
    ),
  },
]

export const UsersList = () => {
  const router = useRouter()
  const role = useParam("userId", "string")
  const page = Number(router.query.page) || 0
  const search = (router.query.search as string) || ""
  const take = Number(router.query.take) || 10
  const [{ users, hasMore, count }] = usePaginatedQuery(getUsers, {
    orderBy: { id: "asc" },
    skip: take * page,
    take: take,
    where: {
      name: {
        contains: search.toLowerCase(),
        mode: "insensitive",
      },
      role: role?.toUpperCase(),
    },
  })

  return (
    <Table
      count={count}
      hasMore={hasMore}
      columns={Columns}
      data={users}
      title={`List of ${role}`}
      rightRender={() => {}}
    />
  )
}

const UsersPage: BlitzPage = () => {
  const role = useParam("userId", "string")
  return (
    <>
      <Head>
        <title>Users</title>
      </Head>

      <div>
        <div className="max-w-xs my-4 ml-auto">
          <Link href={Routes.NewUserPage({ role })}>
            <Button>Create User</Button>
          </Link>
        </div>
        <Suspense fallback={<Loading />}>
          <UsersList />
        </Suspense>
      </div>
    </>
  )
}

UsersPage.authenticate = { redirectTo: Routes.LoginPage() }
UsersPage.getLayout = (page) => <Layout layout="DashboardLayout">{page}</Layout>

export default UsersPage
