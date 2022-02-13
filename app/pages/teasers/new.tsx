import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createTeaser from "app/teasers/mutations/createTeaser"
import { TeaserForm, FORM_ERROR } from "app/teasers/components/MSMETeaserForm"

const NewTeaserPage: BlitzPage = () => {
  const router = useRouter()
  const [createTeaserMutation] = useMutation(createTeaser)

  return (
    <div className="max-w-5xl mx-auto">
      <h1>Create New Teaser</h1>

      <TeaserForm
        submitText="Create Teaser"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateTeaser}
        // initialValues={{}}
        onSubmit={async (values) => {
          console.log("🚀 ~ file: new.tsx ~ line 32 ~ onSubmit={ ~ values", values)
          // try {
          //   const teaser = await createTeaserMutation(values)
          //   router.push(Routes.ShowTeaserPage({ teaserId: teaser.id }))
          // } catch (error: any) {
          //   console.error(error)
          //   return {
          //     [FORM_ERROR]: error.toString(),
          //   }
          // }
        }}
      />

      <p>
        <Link href={Routes.TeasersPage()}>
          <a>Teasers</a>
        </Link>
      </p>
    </div>
  )
}

NewTeaserPage.authenticate = true
NewTeaserPage.getLayout = (page) => (
  <Layout layout="DashboardLayout" title={"Create New Teaser"}>
    {page}
  </Layout>
)

export default NewTeaserPage
