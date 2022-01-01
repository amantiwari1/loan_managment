import { Head, BlitzLayout, useRouter } from "blitz"

import dynamic from "next/dynamic"
const DashboardLayout = dynamic(() => import("app/core/layouts/DashboardLayout"), {
  ssr: false,
})
import AuthLayout from "app/core/layouts/AuthLayout"

const Layout: BlitzLayout<{ title?: string; layout: "AuthLayout" | "DashboardLayout" }> = ({
  title,
  children,
  layout,
}) => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>{title || "Kred Partner"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {layout === "AuthLayout" && <AuthLayout> {children} </AuthLayout>}
      {layout === "DashboardLayout" && <DashboardLayout>{children}</DashboardLayout>}
    </>
  )
}

export default Layout
