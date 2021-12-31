import { Head, BlitzLayout, useRouter } from "blitz"

import dynamic from "next/dynamic"
const DashboardLayout = dynamic(() => import("app/core/layouts/DashboardLayout"), {
  ssr: false,
})
import AuthLayout from "app/core/layouts/AuthLayout"

const AuthLayoutPath = ["/login", "/forgot-password", "/signup", "/reset-password"]

const Layout: BlitzLayout<{ title?: string }> = ({ title, children }) => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>{title || "Kred Partner"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {AuthLayoutPath.includes(router.pathname) ? (
        <AuthLayout> {children} </AuthLayout>
      ) : (
        <DashboardLayout>{children}</DashboardLayout>
      )}
    </>
  )
}

export default Layout
