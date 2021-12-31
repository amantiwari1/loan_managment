import { Menu, Layout, Divider } from "antd"
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
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
import { Image, useMutation } from "blitz"
import logout from "app/auth/mutations/logout"

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
        link: "/enquiries/new",
      },
      {
        name: "New Enquiries",
        icon: PieChartOutlined,
        link: "/enquiries",
      },
      {
        name: "Approved Enquiries",
        icon: PieChartOutlined,
        link: "/enquiries/approved",
      },
      {
        name: "Rejected Enquiries",
        icon: PieChartOutlined,
        link: "/enquiries/rejected",
      },
      {
        name: "Sanctioned Enquiries",
        icon: PieChartOutlined,
        link: "/enquiries/sanctioned",
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
        link: "/users/new",
      },
      {
        name: "Admin",
        icon: PieChartOutlined,
        link: "/users/list/admin",
      },
      {
        name: "Staff",
        icon: PieChartOutlined,
        link: "/users/list/staff",
      },
      {
        name: "Channel Partner",
        icon: PieChartOutlined,
        link: "/users/list/partner",
      },
      {
        name: "Customer",
        icon: PieChartOutlined,
        link: "/users/list/user",
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
  const [logoutMutation] = useMutation(logout)

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

          <Divider />
          <p className="text-center text-xs text-gray-500">ACCOUNT RELATED</p>
          <Menu.Item key="Account" icon={<LogoutOutlined />}>
            Account Setting
          </Menu.Item>
          <Menu.Item
            onClick={async () => await logoutMutation()}
            key="logout"
            icon={<LogoutOutlined />}
          >
            Logout
          </Menu.Item>
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
