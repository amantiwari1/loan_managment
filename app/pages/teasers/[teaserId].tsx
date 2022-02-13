import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getTeaser from "app/teasers/queries/getTeaser"
import deleteTeaser from "app/teasers/mutations/deleteTeaser"

export const Teaser = () => {
  const router = useRouter()
  const teaserId = useParam("teaserId", "number")
  const [deleteTeaserMutation] = useMutation(deleteTeaser)
  const [teaser] = useQuery(getTeaser, { id: teaserId })

  return (
    <>
      <Head>
        <title>Teaser {teaser.id}</title>
      </Head>

      <div>
        <h1>Teaser {teaser.id}</h1>
        <pre>{JSON.stringify(teaser, null, 2)}</pre>

        <Link href={Routes.EditTeaserPage({ teaserId: teaser.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteTeaserMutation({ id: teaser.id })
              router.push(Routes.TeasersPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowTeaserPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.TeasersPage()}>
          <a>Teasers</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Teaser />
      </Suspense>
    </div>
  )
}

ShowTeaserPage.authenticate = true
ShowTeaserPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowTeaserPage
