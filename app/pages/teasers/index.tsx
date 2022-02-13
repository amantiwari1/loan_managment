import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getTeasers from "app/teasers/queries/getTeasers"

const ITEMS_PER_PAGE = 100

export const TeasersList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ teasers, hasMore }] = usePaginatedQuery(getTeasers, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {teasers.map((teaser) => (
          <li key={teaser.id}>
            <Link href={Routes.ShowTeaserPage({ teaserId: teaser.id })}>
              <a>{teaser.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const TeasersPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Teasers</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewTeaserPage()}>
            <a>Create Teaser</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <TeasersList />
        </Suspense>
      </div>
    </>
  )
}

TeasersPage.authenticate = true
TeasersPage.getLayout = (page) => <Layout>{page}</Layout>

export default TeasersPage
