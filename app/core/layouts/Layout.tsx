import { Head, BlitzLayout, useRouter } from "blitz"
import AuthLayout from "app/core/layouts/AuthLayout"
import DashboardLayout from "./DashboardLayout"
import { ReactNode, Suspense } from "react"
import Loading from "../components/Loading"

const Layout: BlitzLayout<{
  title?: string
  layout: "AuthLayout" | "DashboardLayout"
  children: ReactNode
}> = ({ title, children, layout }) => {
  return (
    <>
      <Head>
        <title>{title || "Kred Partner"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {layout === "AuthLayout" && <AuthLayout> {children} </AuthLayout>}
      {layout === "DashboardLayout" && (
        <Suspense fallback={<Loading />}>
          <DashboardLayout>{children}</DashboardLayout>
        </Suspense>
      )}
    </>
  )
}

export default Layout
