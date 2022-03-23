import SibApiV3Sdk from "sib-api-v3-sdk"

export let defaultClient = SibApiV3Sdk.ApiClient.instance

export let apiKey = defaultClient.authentications["api-key"]
apiKey.apiKey = process.env.SENDINBLUE_API_KEY

export let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
