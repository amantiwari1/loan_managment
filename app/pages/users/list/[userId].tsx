import { Suspense } from "react"
import { Head, Link, useRouter, useParam, BlitzPage, Routes, usePaginatedQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import getUsers from "app/users/queries/getUsers"
import { Button } from "app/core/components/Button"
import Loading from "app/core/components/Loading"
import Table, { DateCell } from "app/core/components/Table"
import { ColumnDef } from "@tanstack/react-table"

const Columns = [
  {
    header: "createdAt",
    accessorKey: "createdAt",
    cell: DateCell,
  },
  {
    header: "updatedAt",
    accessorKey: "updatedAt",
    cell: DateCell,
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ getValue }) => <p>{getValue() ? getValue() : "No Name"}</p>,
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Role",
    accessorKey: "role",
  },
  {
    header: "Action",
    accessorKey: "id",
    cell: ({ getValue }) => (
      <Link href={Routes.EditUserPage({ userId: getValue() })}>
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
