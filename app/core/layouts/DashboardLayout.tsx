import { Layout } from "antd"
import {
  LogoutOutlined,
  PieChartOutlined,
  DashboardOutlined,
  UserOutlined,
  FormOutlined,
} from "@ant-design/icons"
import React from "react"
import Link from "next/link"
import logo from "public/logo.png"
import { Image, Routes, useMutation, useQuery, useSession } from "blitz"
import logout from "app/auth/mutations/logout"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import { Divider } from "@chakra-ui/react"
import getCurrentUser from "app/users/queries/getCurrentUser"
import { AiOutlineSetting } from "react-icons/ai"

const { Content } = Layout

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
    role: ["ADMIN", "STAFF"],
    sidebar_data: [
      {
        name: "Add a New Enquiry",
        icon: PieChartOutlined,
        link: "/enquiries/new",
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
    role: ["ADMIN"],

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
    role: ["ADMIN"],
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
  const [logoutMutation] = useMutation(logout)
  const session = useSession()
  const [user] = useQuery(getCurrentUser, null)
  return (
    <div className="flex ">
      <div className="min-w-[17rem]">
        <div className="fixed top-0 bottom-0">
          <ProSidebar className="">
            {/* LOGO */}
            <div className="px-5 bg-white py-2 mt-4">
              <Image src={logo} alt="logo" />
            </div>
            <Menu>
              <MenuItem key="profile">
                <div className="flex justify-end w-full items-center h-full pr-10">
                  <div>
                    <p className="text-xl font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>
                </div>
              </MenuItem>
              {sidebar_data.map((item) => (
                <MenuItem key={item.link} icon={<item.icon />}>
                  <Link href={item.link}>{item.name}</Link>
                </MenuItem>
              ))}
              {sidebar_data_2.map((item) => (
                <>
                  {!["USER", "PARTNER"].includes(session.role as string) && (
                    <SubMenu key={item.name} icon={<item.icon />} title={item.name}>
                      {item.sidebar_data.map((item) => (
                        <MenuItem key={item.link}>
                          <Link href={item.link}>{item.name}</Link>
                        </MenuItem>
                      ))}
                    </SubMenu>
                  )}
                </>
              ))}

              <Divider />
              <MenuItem key="Account" icon={<AiOutlineSetting />}>
                <Link href="/users/profile">Account Setting</Link>
              </MenuItem>
              <MenuItem
                onClick={async () => await logoutMutation()}
                key="logout"
                icon={<LogoutOutlined />}
              >
                Logout
              </MenuItem>
            </Menu>
          </ProSidebar>
        </div>
      </div>
      <div className="w-full h-full bg-[#f9fbfd] min-h-screen">
        <div className="p-5 ">
          <Content
            style={{
              margin: "0px 16px",
              padding: "16px",
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
