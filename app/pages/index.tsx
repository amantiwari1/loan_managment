import { Link, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Card, Divider, Tag } from "antd"
import { Table } from "antd"

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (text) => <Tag color="gold">{text}</Tag>,
  },
  {
    title: "Staff",
    dataIndex: "staff",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Last Updated",
    dataIndex: "staff",
    render: (text) => <a>{new Date().toDateString()}</a>,
  },
]

const data = [
  {
    key: "1",
    name: "Aman Tiwari",
    amount: 300000,
    status: "log in pending",
    staff: "No Staff",
  },
  {
    key: "1",
    name: "Aman Tiwari",
    amount: 300000,
    status: "log in pending",
    staff: "No Staff",
  },
  {
    key: "1",
    name: "Aman Tiwari",
    amount: 300000,
    status: "log in pending",
    staff: "No Staff",
  },
  {
    key: "1",
    name: "Aman Tiwari",
    amount: 300000,
    status: "log in pending",
    staff: "No Staff",
  },
]
/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const cardData = [
  {
    name: "TOTAL ENQUIRIES",
    count: 5,
  },
  {
    name: "ACTIVE ENQUIRIES",
    count: 0,
  },
  {
    name: "REJECTED ENQUIRIES",
    count: 0,
  },
  {
    name: "SANCTIONED ENQUIRIES",
    count: 0,
  },
]

const Home: BlitzPage = () => {
  return (
    <div>
      <p className="text-3xl font-bold">Overview</p>
      <Divider />
      <div className="grid grid-cols-4 gap-5">
        {cardData.map((item) => (
          <Card key={item.name}>
            <p className="text-gray-500 text-xs">{item.name}</p>
            <p className="text-xl font-bold">{item.count}</p>
          </Card>
        ))}
      </div>
      <Divider />

      <Table
        columns={columns}
        dataSource={data}
        bordered
        title={() => <p className="text-lg font-bold">Active Enquiries</p>}
      />
    </div>
  )
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>
Home.authenticate = { redirectTo: Routes.LoginPage() }

export default Home
