import { convertStringToKey } from "app/common"
import { MSMETeaserType } from "app/type"
import React from "react"
import { MSMETeaseData } from "../data"
import logo from "public/logo.png"
import { Image } from "blitz"
import { Td, Table, Tr, Th } from "./ExportTable"

const client_service_options = [
  { value: "HOME_LOAN", label: "Home Loan" },
  { value: "MORTGAGE_LOAN", label: "Mortgage Loan" },
  { value: "UNSECURED_LOAN", label: "Unsecured Loan" },
  { value: "MSME_LOAN", label: "MSME Loan" },
  { value: "STARTUP_LOAN", label: "Startup Loan" },
  { value: "SUBSIDY_SCHEMES", label: "Subsidy Schemes" },
].reduce((obj, item) => Object.assign(obj, { [item.value]: item.label }), {})

const ExportRetailToHtml = ({ data }: { data: MSMETeaserType }) => {
  const tableData = [
    {
      key_parameters: "Name of Applicant",
      particulars: <p>{data?.name}</p>,
    },
    {
      key_parameters: "Reg. Address",
      particulars: (
        <p>{`${data?.house_no ?? ""}, ${data?.street ?? ""}, ${data?.city ?? ""}, ${
          data?.state ?? ""
        }, ${data?.pincode ?? ""}`}</p>
      ),
    },
    {
      key_parameters: "Nature of Business",
      particulars: <p>{data?.nature_of_business}</p>,
    },
    {
      key_parameters: "About the Key Persons",
      particulars: <p>{data?.about_the_key_persons}</p>,
    },
    {
      key_parameters: "Financial Summary",
      particulars: (
        <>
          <p>M/s. {data?.financial_summary} (ITR details)</p>
          <Table>
            <Tr>
              <Th>Particulars</Th>
              {MSMETeaseData?.year.map((arr) => (
                <Th key={arr?.key}>
                  <p>{arr?.name}</p>
                </Th>
              ))}
            </Tr>
            {MSMETeaseData?.summary.slice(0, 5).map((arr) => (
              <Tr key={arr?.key}>
                <Td>
                  <p>{arr?.name}</p>
                </Td>

                {MSMETeaseData?.year.map((arrYear) => (
                  <Td key={arr?.key + "." + arrYear?.key}>
                    <p>{(data[arr?.key] && data[arr?.key][arrYear?.key]) ?? ""}</p>
                  </Td>
                ))}
              </Tr>
            ))}
          </Table>
          <p>Mr./Mrs. {data?.financial_summary1}</p>
          <Table>
            <Tr>
              <Th>
                <p>Particulars</p>
              </Th>
              {MSMETeaseData?.year.map((arr) => (
                <Th key={arr?.key}>
                  <p>{arr?.name}</p>
                </Th>
              ))}
            </Tr>
            {MSMETeaseData?.summary.slice(5).map((arr) => (
              <Tr key={arr?.key}>
                <Td>
                  <p>{arr?.name}</p>
                </Td>

                {MSMETeaseData?.year.map((arrYear) => (
                  <Td key={arr?.key + "." + arrYear?.key}>
                    <p>{(data[arr?.key] && data[arr?.key][arrYear?.key]) ?? ""}</p>
                  </Td>
                ))}
              </Tr>
            ))}
          </Table>
        </>
      ),
    },
    {
      key_parameters: "Existing Facilities",
      particulars: (
        <>
          <p>Proprietor __________ has availed the following Financial facilities:</p>
          <Table>
            {/* <Tr>
              <Th>
                <p>Particulars</p>
              </Th>
            </Tr> */}
            {MSMETeaseData?.ExistingFacilities.map((arr) => (
              <Tr key={arr?.key}>
                <Td>
                  <p>{arr?.name}</p>
                </Td>
                <Td>
                  <p>
                    {arr?.key === "type_of_loan"
                      ? client_service_options[
                          data?.existing_facilities && data?.existing_facilities[arr?.key]
                        ] ?? ""
                      : (data?.existing_facilities && data?.existing_facilities[arr?.key]) ?? ""}
                  </p>
                </Td>
              </Tr>
            ))}
          </Table>
        </>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-center  w-[600px]">
        <div className="!text-xs w-[500px] mx-auto m-1 para-bottom">
          <div className="flex justify-end">
            <div className="max-w-[10rem]">
              <Image src={logo} alt="logo" />
            </div>
          </div>
          <h4 className="text-center font-bold text-2xl my-2 pb-5">Teaser</h4>
          <div className="h-[800px]">
            <Table>
              <Tr>
                <Th>
                  <p>S. No.</p>
                </Th>
                <Th>
                  <p>Key Parameters</p>
                </Th>
                <Th>
                  <p>Particulars</p>
                </Th>
              </Tr>
              {tableData?.slice(0, 9).map((arr, i) => (
                <Tr key={i}>
                  <Td className="text-center">{i + 1} .</Td>
                  <Td className="text-center">{arr?.key_parameters}</Td>
                  <Td> {arr?.particulars}</Td>
                </Tr>
              ))}
            </Table>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[10rem]">
              <Image src={logo} alt="logo" />
            </div>
          </div>
          {/* // TABLE 2 */}
          <div className="h-[800px]">
            <Table>
              <Tr>
                <Th>
                  <p>S. No.</p>
                </Th>
                <Th>
                  <p>Key Parameters</p>
                </Th>
                <Th>
                  <p>Particulars</p>
                </Th>
              </Tr>
              {tableData?.slice(9, 11).map((arr, i) => (
                <Tr key={i}>
                  <Td className="text-center">{i + 10} .</Td>
                  <Td className="text-center">{arr?.key_parameters}</Td>
                  <Td> {arr?.particulars}</Td>
                </Tr>
              ))}
            </Table>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[10rem]">
              <Image src={logo} alt="logo" />
            </div>
          </div>
          {/* // TABLE 3 */}
          <div className="h-[800px]">
            <Table>
              <Tr>
                <Th>
                  <p>S. No.</p>
                </Th>
                <Th>
                  <p>Key Parameters</p>
                </Th>
                <Th>
                  <p>Particulars</p>
                </Th>
              </Tr>
              {tableData?.slice(11).map((arr, i) => (
                <Tr key={i}>
                  <Td className="text-center">{i + 12} .</Td>
                  <Td className="text-center">{arr?.key_parameters}</Td>
                  <Td> {arr?.particulars}</Td>
                </Tr>
              ))}
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportRetailToHtml
