import {
  AppProps,
  ErrorBoundary,
  ErrorComponent,
  AuthenticationError,
  AuthorizationError,
  ErrorFallbackProps,
  useQueryErrorResetBoundary,
  dynamic,
} from "blitz"
import LoginForm from "app/auth/components/LoginForm"
import "app/core/styles/index.css"
import "react-pro-sidebar/dist/css/styles.css"
import "react-day-picker/lib/style.css"
import "nprogress/nprogress.css"
const TopProgressBar = dynamic(
  () => import("app/core/components/TopProgressBar").then((mode) => mode.default()),
  { ssr: false }
)
import { createStandaloneToast } from "@chakra-ui/toast"

const { ToastContainer, toast } = createStandaloneToast()

export { toast }

import { ChakraProvider, withDefaultColorScheme, withDefaultVariant } from "@chakra-ui/react"

import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme(
  {
    fonts: {
      body: "sans-serif",
      heading: "sans-serif",
      mono: "sans-serif",
    },
    shadows: {
      outline: "0 0 0 3px rgba(145, 184, 65, 0.6)",
    },
    colors: {
      Customgreen: {
        50: "#c3ea73",
        100: "#b9e069",
        200: "#afd65f",
        300: "#a5cc55",
        400: "#9bc24b",
        500: "#91b841",
        600: "#87ae37",
        700: "#7da42d",
        800: "#739a23",
        900: "#699019",
      },
      Customblue: {
        50: "#565779",
        100: "#4c4d6f",
        200: "#424365",
        300: "#38395b",
        400: "#2e2f51",
        500: "#242547",
        600: "#1a1b3d",
        700: "#101133",
        800: "#060729",
        900: "#00001f",
      },
    },
  },
  withDefaultColorScheme({
    colorScheme: "Customblue",
  })
)

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary
        FallbackComponent={RootErrorFallback}
        onReset={useQueryErrorResetBoundary().reset}
      >
        <TopProgressBar />
        <ToastContainer />
        {getLayout(<Component {...pageProps} />)}
      </ErrorBoundary>
    </ChakraProvider>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <LoginForm onSuccess={resetErrorBoundary} />
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
    )
  }
}
