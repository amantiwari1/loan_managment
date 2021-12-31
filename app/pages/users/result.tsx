import { useRouter, BlitzPage, Routes, useParam, useRouterQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import { notification, Result } from "antd"
import { Button } from "app/core/components/Button"

const ResultUserPage: BlitzPage = () => {
  const token = useRouterQuery()

  return (
    <div className="max-w-5xl mx-auto">
      <Result
        status="success"
        title="Successfully Created User"
        subTitle={token.token}
        extra={[
          <Button
            key="console"
            onClick={() => {
              navigator.clipboard.writeText(token.token as any).then(() => {
                notification.success({
                  message: "Copied the Link",
                })
              })
            }}
          >
            Copy Link
          </Button>,
        ]}
      />
    </div>
  )
}

ResultUserPage.authenticate = { redirectTo: Routes.LoginPage() }
ResultUserPage.getLayout = (page) => <Layout title={"Create New User"}>{page}</Layout>

export default ResultUserPage
