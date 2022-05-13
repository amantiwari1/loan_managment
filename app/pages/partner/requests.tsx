import { Suspense } from "react"
import { Head, usePaginatedQuery, useRouter, BlitzPage, Routes, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getChannelPartners from "app/channel-partners/queries/getChannelPartners"
import Loading from "app/core/components/Loading"

import {
  IconButton,
  Button,
  PopoverArrow,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react"
import { IoMdRefresh } from "react-icons/io"
import { CheckIcon, CloseIcon } from "@chakra-ui/icons"
import updateChannelPartnerRequest from "app/channel-partners/mutations/updateChannelPartnerRequest"
import { toast } from "../_app"
import Table from "app/core/components/Table"

const ITEMS_PER_PAGE = 100

export const ChannelPartnersList = () => {
  const [updatePartnerMutation, { isLoading }] = useMutation(updateChannelPartnerRequest)
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ channelPartners, hasMore }, { refetch }] = usePaginatedQuery(getChannelPartners, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    where: {
      request: "PENDING",
    },
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  const columns = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Company",
      accessor: "company",
    },
    {
      Header: "Phone",
      accessor: "phone",
      render: ({ value }) => <p>{value.toString()}</p>,
    },
    {
      Header: "City",
      accessor: "city",
    },
    {
      Header: "Actions",
      accessor: "id",
      render: ({ value }) => (
        <div className="space-x-5">
          <Popover>
            <PopoverTrigger>
              <IconButton
                aria-label="Accept"
                variant="outline"
                isLoading={isLoading}
                colorScheme="Customgreen"
                icon={<CheckIcon />}
              />
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>Confirmation</PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  <Text>Are you sure you want to approve this enquiry?</Text>
                  <div className="flex justify-end mr-2 mt-1">
                    <Button
                      isLoading={isLoading}
                      onClick={async () => {
                        const token: any = await updatePartnerMutation({
                          id: value,
                          request: "APPROVED",
                        })

                        router.push(Routes.ResultUserPage({ token }))
                      }}
                      w={50}
                    >
                      Yes
                    </Button>
                  </div>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
          <Popover>
            <PopoverTrigger>
              <IconButton
                aria-label="Accept"
                variant="outline"
                isLoading={isLoading}
                colorScheme="red"
                icon={<CloseIcon />}
              />
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>Confirmation</PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  <Text>Are you sure you want to reject this enquiry?</Text>
                  <div className="flex justify-end mr-2 mt-1">
                    <Button
                      isLoading={isLoading}
                      onClick={async () => {
                        await updatePartnerMutation({
                          id: value,
                          request: "REJECTED",
                        })

                        await refetch()
                      }}
                      w={50}
                    >
                      Yes
                    </Button>
                  </div>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </div>
      ),
    },
  ]

  return (
    <div>
      <Table
        title="Channel Partner Request"
        columns={columns}
        data={channelPartners}
        rightRender={() => (
          <IconButton
            aria-label="Search database"
            onClick={async () => {
              await refetch()
              toast({
                title: "Updated",
                status: "success",
                isClosable: true,
              })
            }}
            variant="outline"
            icon={<IoMdRefresh />}
          />
        )}
      />
    </div>
  )
}

const ChannelPartnersRequestPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Channel Partners Request</title>
      </Head>

      <div>
        <Suspense fallback={<Loading />}>
          <ChannelPartnersList />
        </Suspense>
      </div>
    </>
  )
}

ChannelPartnersRequestPage.authenticate = true
ChannelPartnersRequestPage.getLayout = (page) => <Layout layout="DashboardLayout">{page}</Layout>

export default ChannelPartnersRequestPage
