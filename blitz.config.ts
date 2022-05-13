import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"

const config: BlitzConfig = {
  middleware: [
    sessionMiddleware({
      cookiePrefix: "kred_partner",
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
}

module.exports = config
