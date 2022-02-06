import { User, UsersOnEnquires } from "@prisma/client"

interface EnquireUserInterface {
  value: number
  label: string
}

interface EnquiryUser {
  id: number
  partner: (UsersOnEnquires & {
    user: User
  })[]
  customer: UsersOnEnquires & {
    user: User
  }
  staff: (UsersOnEnquires & {
    user: User
  })[]
  users: (UsersOnEnquires & {
    user: User
  })[]
}

interface getUsersType {
  users: User[]
  nextPage: {
    take: number
    skip: number
  }
  hasMore: boolean
  count: number
}
