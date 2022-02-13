import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getTeaser from "app/teasers/queries/getTeaser"
import updateTeaser from "app/teasers/mutations/updateTeaser"
import { TeaserForm, FORM_ERROR } from "app/teasers/components/MSMETeaserForm"

export const EditTeaser = () => {
  const router = useRouter()
  const teaserId = useParam("teaserId", "number")
  const [teaser, { setQueryData }] = useQuery(
    getTeaser,
    { id: teaserId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateTeaserMutation] = useMutation(updateTeaser)

  return (
    <>
      <Head>
        <title>Edit Teaser {teaser.id}</title>
      </Head>

      <div>
        <h1>Edit Teaser {teaser.id}</h1>
        <pre>{JSON.stringify(teaser, null, 2)}</pre>

        <TeaserForm
          submitText="Update Teaser"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateTeaser}
          initialValues={teaser}
          onSubmit={async (values) => {
            try {
              const updated = await updateTeaserMutation({
                id: teaser.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowTeaserPage({ teaserId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditTeaserPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditTeaser />
      </Suspense>

      <p>
        <Link href={Routes.TeasersPage()}>
          <a>Teasers</a>
        </Link>
      </p>
    </div>
  )
}

EditTeaserPage.authenticate = true
EditTeaserPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditTeaserPage
