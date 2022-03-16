import SibApiV3Sdk from "sib-api-v3-sdk"

export let defaultClient = SibApiV3Sdk.ApiClient.instance

export let apiKey = defaultClient.authentications["api-key"]
apiKey.apiKey =
  "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"

export let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
