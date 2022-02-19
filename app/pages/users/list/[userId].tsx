import { Suspense } from "react"
import { Head, Link, useRouter, useParam, BlitzPage, Routes, usePaginatedQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import getUsers from "app/users/queries/getUsers"
import { Table } from "antd"
import { Button } from "app/core/components/Button"
import Loading from "app/core/components/Loading"

const ITEMS_PER_PAGE = 100

//   {
//     id: 1,
//     createdAt: "2021-12-31T15:57:52.557Z",
//     updatedAt: "2021-12-31T17:59:37.727Z",
//     name: null,
//     email: "amantiwari78632@gmail.com",
//     hashedPassword:
//       "JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJGVCanV6Y0FwQXZqbCthdE5qMWRBUnckcjdUc1dqNTYwZ01uaUZzdVpIbWZhd29DOXlLVEpGaVE3ck10M0kxVDJsQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
//     role: "ADMIN",
//   }
// ]

const Columns = [
  {
    title: "createdAt",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => <a>{new Date(text).toDateString()}</a>,
  },
  {
    title: "updatedAt",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (text) => <a>{new Date(text).toDateString()}</a>,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (name) => <p>{name ? name : "No Name"}</p>,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Action",
    dataIndex: "id",
    key: "id",
    render: (id) => (
      <Link href={Routes.EditUserPage({ userId: id })}>
        <a className="text-blue-400"> Edit</a>
      </Link>
    ),
  },
]

export const UsersList = () => {
  const router = useRouter()
  const role = useParam("userId", "string")
  const page = Number(router.query.page) || 0
  const [{ users, hasMore }] = usePaginatedQuery(getUsers, {
    where: {
      role: role?.toUpperCase(),
    },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <Table scroll={{ x: "max-content" }} bordered columns={Columns} dataSource={users} />

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const UsersPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Users</title>
      </Head>

      <div>
        <div className="max-w-xs my-4 ml-auto">
          <Link href={Routes.NewUserPage()}>
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
