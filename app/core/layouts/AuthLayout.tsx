import { Grid, GridItem } from "@chakra-ui/react"
import { BlitzPage } from "blitz"
import { ReactNode } from "react"

const LoginPage: BlitzPage<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <div>
        <div className="md:hidden grid place-items-center min-h-screen p-5">{children}</div>
      </div>
      <div className="hidden md:block">
        <Grid templateColumns="repeat(12, 1fr)">
          <GridItem colSpan={4} w="100%">
            <div className="grid place-items-center min-h-screen px-2">{children}</div>
          </GridItem>
          <GridItem colSpan={8} w="100%">
            <div
              className="min-h-screen bg-cover bg-no-repeat bg-center"
              style={{ backgroundImage: "url('/login-cover.jpg')" }}
            ></div>
          </GridItem>
        </Grid>
      </div>
    </div>
  )
}

export default LoginPage
