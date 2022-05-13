import { AiOutlineDashboard, AiOutlineUser, AiOutlineForm } from "react-icons/ai"
import React, { useState } from "react"
import Link from "next/link"
import logo from "public/logo.png"
import { Image, Routes, useMutation, useQuery, useRouter, useSession } from "blitz"
import logout from "app/auth/mutations/logout"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import { Divider } from "@chakra-ui/react"
import getCurrentUser from "app/users/queries/getCurrentUser"
import { AiOutlineClose, AiOutlineSetting } from "react-icons/ai"
import { FaHeart, FaBars } from "react-icons/fa"
import { IoLogOutOutline } from "react-icons/io5"
import { FiPieChart } from "react-icons/fi"

const sidebar_data = [
  {
    name: "Dashboard",
    icon: AiOutlineDashboard,
    link: "/",
  },
]
const sidebar_data_2 = [
  {
    name: "Enquiries",
    icon: AiOutlineForm,
    role: ["STAFF"],
    link: "/enquiries",
    sidebar_data: [
      {
        name: "Add a New Enquiry",
        icon: FiPieChart,
        link: "/enquiries/new",
      },
    ],
  },
  {
    name: "Enquiries",
    icon: AiOutlineForm,
    role: ["ADMIN"],
    link: "/enquiries",
    sidebar_data: [
      {
        name: "Add a New Enquiry",
        icon: FiPieChart,
        link: "/enquiries/new",
      },
      {
        name: "Enquiry Request",
        icon: FiPieChart,
        link: "/enquiries/request",
      },
      {
        name: "Approved Enquiries",
        icon: FiPieChart,
        link: "/enquiries/approved",
      },
      {
        name: "Rejected Enquiries",
        icon: FiPieChart,
        link: "/enquiries/rejected",
      },
      {
        name: "Sanctioned Enquiries",
        icon: FiPieChart,
        link: "/enquiries/sanctioned",
      },
    ],
  },
  {
    name: "Users",
    icon: AiOutlineUser,
    role: ["ADMIN"],
    link: "/users",
    sidebar_data: [
      {
        name: "Add a new user",
        icon: FiPieChart,
        link: "/users/new",
      },
      {
        name: "Admin",
        icon: FiPieChart,
        link: "/users/list/admin",
      },
      {
        name: "Staff",
        icon: FiPieChart,
        link: "/users/list/staff",
      },
      {
        name: "Channel Partner",
        icon: FiPieChart,
        link: "/users/list/partner",
      },
      {
        name: "Customer",
        icon: FiPieChart,
        link: "/users/list/user",
      },
    ],
  },
  {
    name: "Channel Partner",
    icon: FiPieChart,
    link: "/partner",
    role: ["ADMIN"],
    sidebar_data: [
      {
        name: "All Channel Partner",
        icon: FiPieChart,
        link: "/partner",
      },
      {
        name: "Channel Partner Requests",
        icon: FiPieChart,
        link: "/partner/requests",
      },
    ],
  },
]

const Sidebar = ({ children }) => {
  const [logoutMutation] = useMutation(logout)
  const session = useSession()
  const router = useRouter()
  const [toggled, setToggled] = useState(false)
  const [user] = useQuery(getCurrentUser, null, {
    refetchOnWindowFocus: false,
  })
  return (
    <div className="md:grid md:grid-cols-12">
      <div className="md:col-span-3 lg:col-span-2">
        <div>
          <ProSidebar breakPoint="md" toggled={toggled} className="!min-w-full !w-full">
            {/* LOGO */}
            <div className="md:hidden text-2xl p-2 ml-auto" onClick={() => setToggled(false)}>
              <AiOutlineClose />
            </div>
            <div className="hidden md:block px-5 bg-white py-2 mt-4">
              <Image src={logo} alt="logo" />
            </div>

            <Menu>
              <MenuItem key="profile">
                <div className="">
                  <div>
                    <p className="text-xl font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>
                </div>
              </MenuItem>
              {sidebar_data.map((item) => (
                <MenuItem
                  active={router.pathname === item.link}
                  key={item.link}
                  icon={<item.icon />}
                  onClick={() => setToggled(false)}
                >
                  <Link href={item.link} passHref={true}>
                    <div className={router.pathname === item.link ? "link_nav_bar active" : ""}>
                      {item.name}
                    </div>
                  </Link>
                </MenuItem>
              ))}
              {sidebar_data_2.map((item) => (
                <div key={item.name}>
                  {item.role.includes(session.role as string) && (
                    <SubMenu icon={<item.icon />} title={item.name}>
                      {item.sidebar_data.map((item) => (
                        <MenuItem key={item.link} onClick={() => setToggled(false)}>
                          <Link href={item.link} passHref={true}>
                            <div
                              className={router.pathname === item.link ? "link_nav_bar active" : ""}
                            >
                              {item.name}
                            </div>
                          </Link>
                        </MenuItem>
                      ))}
                    </SubMenu>
                  )}
                </div>
              ))}

              <Divider my={4} />
              <MenuItem key="Account" icon={<AiOutlineSetting />} onClick={() => setToggled(false)}>
                <Link href="/users/profile">Account Setting</Link>
              </MenuItem>
              <MenuItem
                onClick={async () => await logoutMutation()}
                key="logout"
                icon={<IoLogOutOutline />}
              >
                Logout
              </MenuItem>
            </Menu>
          </ProSidebar>
        </div>
      </div>
      <div className="w-full h-full bg-[#f9fbfd] min-h-screen  md:col-span-9 lg:col-span-10">
        <div className="md:hidden flex space-x-1">
          <div className=" text-2xl pt-3 px-4" onClick={() => setToggled(true)}>
            <FaBars />
          </div>
          <div className=" bg-white w-60 pt-1 h-auto">
            <Image src={logo} alt="logo" />
          </div>
        </div>
        <div className="md:p-5 ">
          <div
            style={{
              margin: "0px 5px",
              padding: "5px",
              minHeight: 280,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
