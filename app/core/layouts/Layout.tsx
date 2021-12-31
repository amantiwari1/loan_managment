import { Head, BlitzLayout, useRouter } from "blitz"

import dynamic from "next/dynamic"
const DashboardLayout = dynamic(() => import("app/core/layouts/DashboardLayout"), {
  ssr: false,
})

const AuthLayoutPath = ["/login"]

const Layout: BlitzLayout<{ title?: string }> = ({ title, children }) => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>{title || "Kred Partner"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {AuthLayoutPath.includes(router.pathname) ? (
        <> {children} </>
      ) : (
        <DashboardLayout>{children}</DashboardLayout>
      )}
    </>
  )
}

export default Layout
