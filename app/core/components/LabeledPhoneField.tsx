import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef, useState } from "react"
import { useField, UseFieldConfig } from "react-final-form"
import { useAuthSignInWithPhoneNumber } from "@react-query-firebase/auth"
import { Input } from "@chakra-ui/input"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { auth } from "../firebase"
import { Button } from "./Button"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { toast } from "app/pages/_app"

function isPhoneNumberValid(phoneNumber: string) {
  const pattern = /^\+[0-9\s\-\(\)]+$/
  return phoneNumber.search(pattern) !== -1
}

declare global {
  interface Window {
    recaptchaVerifier: any
    confirmationResult: any
  }
}

export interface LabeledPhoneFieldProps extends ComponentPropsWithoutRef<typeof Input> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
}

export const LabeledPhoneField = forwardRef<HTMLInputElement, LabeledPhoneFieldProps>(
  ({ name, label, outerProps, fieldProps, labelProps, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      parse:
        props.type === "number"
          ? (Number as any)
          : // Converting `""` to `null` ensures empty values will be set to null in the DB
            (v) => (v === "" ? null : v),
      ...fieldProps,
    })

    const { input: OTPCode } = useField<string>("code")
    const { input: isVerifiedPhone } = useField<boolean>("isVerifiedPhone")

    const [otp, setOtp] = useState({
      model: false,
      isVerifyLoading: false,
      isOtpLoading: false,
    })

    const onSignInSubmit = async () => {
      const phone = input.value

      if (!phone || phone.toString().length !== 10) {
        return "await trigger('phone')"
      }

      setOtp({
        ...otp,
        isVerifyLoading: true,
      })

      if (!window.recaptchaVerifier) configureCaptcha()

      const appVerifier = window.recaptchaVerifier
      const number = `+91${phone}`

      signInWithPhoneNumber(auth, number, appVerifier)
        .then(function (confirmationResult) {
          window.confirmationResult = confirmationResult
          setOtp({ ...otp, model: true, isVerifyLoading: false })
        })
        .catch(function (error) {
          console.error(error)
          setOtp({
            ...otp,
            isVerifyLoading: false,
          })
        })
    }

    const configureCaptcha = () => {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha",
        {
          size: "invisible",
          callback: () => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            onSignInSubmit()
          },
          defaultCountry: "IN",
        },
        auth
      )
    }

    const onSubmitOTP = () => {
      const code = OTPCode.value
      if (!code || code.length !== 6) {
        return "trigger('code')"
      }
      setOtp({ ...otp, isOtpLoading: true })
      window.confirmationResult
        .confirm(code)
        .then((result) => {
          if (result.user.phoneNumber) {
            setOtp({
              ...otp,
              isOtpLoading: false,
              model: false,
            })

            isVerifiedPhone.onChange(true)
            return "done"
          }

          setOtp({
            ...otp,
            isOtpLoading: false,
          })
          return toast({
            title: "Incorrect code entered.",
            status: "error",
            isClosable: true,
          })
        })
        .catch((error) => {
          setOtp({
            ...otp,
            isOtpLoading: false,
          })
          toast({
            title: "Incorrect code entered.",
            status: "error",
            isClosable: true,
          })
        })
    }

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <div {...outerProps}>
        <div className="flex space-x-2 items-center">
          <FormLabel {...labelProps}>
            <span className=" text-gray-700">{label}</span>
            <Input
              bg="white"
              {...input}
              disabled={submitting || isVerifiedPhone.value || otp.model}
              {...props}
              className="w-full mt-1 py-3 px-2  border-2 border-blue-300 bg-white  rounded-md focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
              ref={ref}
            />
            <div role="alert" className="text-red-500 min-h-[20px]">
              {touched && normalizedError && <>{normalizedError}</>}
            </div>
          </FormLabel>

          <Button
            disabled={isVerifiedPhone.value || otp.isVerifyLoading || otp.model}
            w={200}
            isLoading={otp.isVerifyLoading}
            onClick={() => {
              try {
                onSignInSubmit()
              } catch (e) {
                console.log(e)
              }
            }}
          >
            {isVerifiedPhone.value ? `Verified` : `Send OTP`}
          </Button>

          {otp.model && (
            <Button
              w={200}
              onClick={() => {
                setOtp({ ...otp, model: false })
              }}
            >
              Edit Phone
            </Button>
          )}
        </div>

        {otp.model && (
          <div className="flex space-x-2 items-center">
            <span className=" text-gray-700">OTP</span>
            <Input
              bg="white"
              {...OTPCode}
              disabled={isVerifiedPhone.value}
              w={300}
              placeholder="Enter OTP"
              className="w-[30px] mt-1 mb-2 py-3 px-2  border-2 border-blue-300 bg-white  rounded-md focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            />

            <Button
              disabled={isVerifiedPhone.value || otp.isOtpLoading}
              isLoading={otp.isOtpLoading}
              onClick={() => {
                try {
                  onSubmitOTP()
                } catch (e) {
                  console.log(e)
                }
              }}
              w={200}
            >
              Verify OTP
            </Button>
          </div>
        )}

        <div id="recaptcha"></div>
      </div>
    )
  }
)

export default LabeledPhoneField
