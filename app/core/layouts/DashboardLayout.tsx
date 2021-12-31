import { Menu, Layout } from "antd"
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DashboardOutlined,
  UserOutlined,
  FormOutlined,
} from "@ant-design/icons"
import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import SubMenu from "antd/lib/menu/SubMenu"
import logo from "public/logo.png"
import { Image } from "blitz"

const { Header, Sider, Content } = Layout

const sidebar_data = [
  {
    name: "Dashboard",
    icon: DashboardOutlined,
    link: "/",
  },
]
const sidebar_data_2 = [
  {
    name: "Enquiries",
    icon: FormOutlined,
    sidebar_data: [
      {
        name: "Add a New Enquiry",
        icon: PieChartOutlined,
        link: "/enquiry/new",
      },
      {
        name: "New Enquiries",
        icon: PieChartOutlined,
        link: "/enquiry",
      },
      {
        name: "Approved Enquiries",
        icon: PieChartOutlined,
        link: "/enquiry/approved",
      },
      {
        name: "Rejected Enquiries",
        icon: PieChartOutlined,
        link: "/enquiry/rejected",
      },
      {
        name: "Sanctioned Enquiries",
        icon: PieChartOutlined,
        link: "/enquiry/sanctioned",
      },
    ],
  },
  {
    name: "Users",
    icon: UserOutlined,

    sidebar_data: [
      {
        name: "Add a new user",
        icon: PieChartOutlined,
        link: "/user/new",
      },
      {
        name: "Admin",
        icon: PieChartOutlined,
        link: "/user/admin",
      },
      {
        name: "Staff",
        icon: PieChartOutlined,
        link: "/user/staff",
      },
      {
        name: "Channel Partner",
        icon: PieChartOutlined,
        link: "/user/partner",
      },
      {
        name: "Customer",
        icon: PieChartOutlined,
        link: "/user/customer",
      },
    ],
  },
  {
    name: "Channel Partner",
    icon: PieChartOutlined,

    sidebar_data: [
      {
        name: "All Channel Partner",
        icon: PieChartOutlined,
        link: "/partner",
      },
      {
        name: "Channel Partner Requests",
        icon: PieChartOutlined,
        link: "/partner/requests",
      },
    ],
  },
]

const Sidebar = ({ children }) => {
  const [collapsed, setcollapsed] = useState(false)
  const router = useRouter()

  const toggle = () => {
    console.log(router.pathname)
    setcollapsed(!collapsed)
  }
  return (
    <Layout>
      <Sider theme="light" style={{ width: 200 }} trigger={null} collapsible collapsed={collapsed}>
        <div className="p-5">
          <Image src={logo} alt="logo" />
        </div>

        <Menu mode="inline" defaultSelectedKeys={[router.pathname]}>
          {sidebar_data.map((item) => (
            <Menu.Item key={item.link} icon={<item.icon />}>
              <Link href={item.link}>{item.name}</Link>
            </Menu.Item>
          ))}
          {sidebar_data_2.map((item) => (
            <SubMenu key={item.name} icon={<item.icon />} title={item.name}>
              {item.sidebar_data.map((item) => (
                <Menu.Item key={item.link}>
                  <Link href={item.link}>{item.name}</Link>
                </Menu.Item>
              ))}
            </SubMenu>
          ))}
        </Menu>
      </Sider>
      <Layout className="min-h-screen">
        <Header className="bg-[#fff]" style={{ padding: 0 }}></Header>
        <Content
          style={{
            margin: "0px 16px",
            padding: "16px",
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default Sidebar
