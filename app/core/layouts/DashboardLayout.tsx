import { Layout } from "antd"
import {
  LogoutOutlined,
  PieChartOutlined,
  DashboardOutlined,
  UserOutlined,
  FormOutlined,
} from "@ant-design/icons"
import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import logo from "public/logo.png"
import { Image, useMutation, useSession } from "blitz"
import logout from "app/auth/mutations/logout"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import { Divider } from "@chakra-ui/react"
import { useCurrentUser } from "../hooks/useCurrentUser"

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

  return (
    <div className="flex ">
      <div className="min-w-[17rem]">
        <div className="fixed top-0 bottom-0">
          <ProSidebar className="">
            <div className="px-5 bg-white py-2">
              <Image src={logo} alt="logo" />
            </div>
            <Menu>
              {sidebar_data.map((item) => (
                <MenuItem key={item.link} icon={<item.icon />}>
                  <Link href={item.link}>{item.name}</Link>
                </MenuItem>
              ))}
              {sidebar_data_2.map((item) => (
                <>
                  {session.role !== "USER" && (
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
              <MenuItem key="Account" icon={<LogoutOutlined />}>
                Account Setting
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
      <div className="w-full h-full bg-[#f0f2f5] min-h-screen">
        <div className="bg-white w-full h-16"></div>
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
