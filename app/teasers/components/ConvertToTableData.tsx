import { client_service_options, constructObject, convertStringToKey } from "app/common"
import { MSMETeaseData } from "../data"
import { logoURL } from "./logo"

import {
  AlignmentType,
  BorderStyle,
  Document,
  Header,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
} from "docx"

const dataObject: any = {
  ...constructObject(MSMETeaseData.ExistingFacilities),
  ...constructObject(MSMETeaseData.ProposedFacilities),
  ...constructObject(MSMETeaseData.SecurityOffered),
  existing_facilities: "Existiing Facilities",
  proposed_facilities: "Proposed Facilities",
  security_offered: "Security Facilities",
  guarantee1: "1.",
  guarantee2: "2.",
}

function transpose(a: any[]) {
  return Object.keys(a[0]).map(function (c) {
    return a.map(function (r) {
      return r[c]
    })
  })
}

const OrderedData = [
  { key: "name", name: "Name" },
  { key: "constitution", name: "Constitution" },
  { key: "Proprietorship", name: "Proprietorship" },
  { key: "reg_address", name: "Reg Address" },
  { key: "Incorporation", name: "Incorporation" },
  { key: "about_the_key_persons", name: "About the key persons" },
  { key: "financial_summary", name: "Financial Summary" },
  { key: "existing_facilities", name: "Existing Facilities" },
  { key: "proposed_facilities", name: "Proposed Facilities" },
  { key: "security_offered", name: "Security Offered" },
  { key: "guarantee", name: "Guarantee" },
]

const RetailOrderedData = [
  { key: "name", name: "Name of Applicant" },
  { key: "occupation", name: "Occupation" },
  { key: "reg_address", name: "Reg Address" },
  { key: "about_the_key_persons", name: "About the key persons" },
  { key: "financial_summary", name: "Financial Summary" },
  { key: "existing_facilities", name: "Existing Facilities" },
]

const FONT_SIZE = 10
const YearHeader = ["Particulars", "F.Y. 2018-19", "F.Y. 2019-20", "F.Y. 2020-21", "F.Y. 2021-22"]
const ProposedHeader = ["S.No.", "Nature of Facility", " Amount In Lacs"]

const ProposedHeaderText = ProposedHeader.map((arr) => {
  return {
    text: arr,
    fontSize: FONT_SIZE,
    bold: true,
  }
})

export const MSMETableData = (data: any, ordereddata: any) => {
  return ordereddata.flatMap((arr: any, index: any) => {
    if (!data) {
      return []
    }

    // ADDRESS
    if (arr.key === "reg_address") {
      return [
        [
          index + 1,
          { text: arr.name, fontSize: FONT_SIZE, bold: true },
          {
            text: `${data["house_no"] ?? ""},  ${data["street"] ?? ""},  ${data["city"] ?? ""}, ${
              data["state"] ?? ""
            }, ${data["pincode"] ?? ""}`,
            fontSize: FONT_SIZE,
          },
        ],
      ]
    }

    // financial_summary
    if (arr.key === "financial_summary") {
      let years = MSMETeaseData.summary.slice(0, 5).map((arr) => {
        if (!data[convertStringToKey(arr.name)]) {
          return [{ text: arr.name, fontSize: FONT_SIZE, bold: true }, ...["-", "-", "-", "-"]]
        }

        console.log(
          "🚀 ~ file: ConvertToTableData.tsx ~ line 92 ~ years ~ data[convertStringToKey(arr.name)]",
          data[convertStringToKey(arr.name)]
        )

        const datavalue = Object.values(data[convertStringToKey(arr.name)])
        const preData3 = datavalue.map((arr) => {
          return { text: arr, fontSize: FONT_SIZE }
        })

        console.log(
          "🚀 ~ file: ConvertToTableData.tsx ~ line 95 ~ years ~ preData3.length",
          preData3.length
        )
        if (preData3.length < 4) {
          const filledNeeded = Array(4 - preData3.length).fill("-")
          filledNeeded.forEach((arr) => {
            preData3.push(arr)
          })
        }

        return [{ text: arr.name, fontSize: FONT_SIZE, bold: true }, ...preData3]
      })

      // half year
      const halfYear = MSMETeaseData.summary.slice(5).map((arr) => {
        if (!data[convertStringToKey(arr.name)]) {
          return [{ text: arr.name, fontSize: FONT_SIZE, bold: true }, ...["-", "-", "-", "-"]]
        }

        const preData3 = Object.values(data[convertStringToKey(arr.name)]).map((arr) => [
          { text: arr, fontSize: FONT_SIZE },
        ])

        if (preData3.length !== 5) {
          const filledNeeded = Array(5 - preData3.length).fill("-")
          filledNeeded.forEach((arr) => {
            preData3.push(arr)
          })
        }

        return [{ text: arr.name, fontSize: FONT_SIZE, bold: true }, ...preData3]
      })

      return [
        [
          index + 1,
          { text: arr.name, fontSize: FONT_SIZE, bold: true },
          [
            {
              text: `M/s. ${data["financial_summary"] ?? "___________"} (ITR details) :`,
              fontSize: FONT_SIZE,
              bold: true,
              margin: [10, 10, 10, 10],
            },
            {
              table: {
                widths: ["auto", "*", "*", "*", "*"],
                body: [
                  [
                    ...YearHeader.map((arr) => {
                      return {
                        text: arr,
                        fontSize: FONT_SIZE,
                        bold: true,
                      }
                    }),
                  ],
                  ...years,
                ],
              },
            },
            {
              text: `Mr./Mrs. ${data["financial_summary1"] ?? "___________"}`,
              fontSize: FONT_SIZE,
              bold: true,
              margin: [10, 10, 10, 10],
            },
            {
              table: {
                widths: ["auto", "*", "*", "*", "*"],
                body: [
                  [
                    ...YearHeader.map((arr) => {
                      return {
                        text: arr,
                        fontSize: FONT_SIZE,
                        bold: true,
                      }
                    }),
                  ],
                  ...halfYear,
                ],
              },
            },
          ],
        ],
      ]
    }

    // NULL

    if (!data[arr.key] || (data[arr.key] && data[arr.key].length === 0)) {
      return []
    }

    if (typeof data[arr.key] === "string") {
      // Normal string
      return [
        [
          index + 1,
          { text: arr.name, fontSize: FONT_SIZE, bold: true },
          { text: data[arr.key], fontSize: FONT_SIZE },
        ],
      ]
    }

    // NESTED TABLE
    const preData1 = Object.entries<string>(data[arr.key]).map((Nestarr, i) => {
      let name = Nestarr[1]

      if (Nestarr[0] === "type_of_loan") {
        name = client_service_options[Nestarr[1]]
      }

      if (convertStringToKey(arr.name) === "proposed_facilities") {
        return [
          { text: i + 1, fontSize: FONT_SIZE },
          { text: dataObject[Nestarr[0]] ?? Nestarr[0], fontSize: FONT_SIZE, bold: true },
          { text: name, fontSize: FONT_SIZE },
        ]
      }
      return [
        { text: dataObject[Nestarr[0]] ?? Nestarr[0], fontSize: FONT_SIZE, bold: true },
        { text: name, fontSize: FONT_SIZE },
      ]
    })

    const Parameters = dataObject[convertStringToKey(arr.name)] ?? arr.name

    if (convertStringToKey(arr.name) === "existing_facilities") {
      return [
        [
          index + 1,
          {
            text: Parameters,
            fontSize: FONT_SIZE,
            bold: true,
          },
          [
            {
              text: `Proprietor __________ has availed the following Financial facilities:`,
              fontSize: FONT_SIZE,
              bold: true,
              margin: [10, 10, 10, 10],
            },
            { table: { widths: ["auto", "*"], body: preData1 } },
          ],
        ],
      ]
    }

    if (convertStringToKey(arr.name) === "proposed_facilities") {
      return [
        [
          index + 1,
          {
            text: Parameters,
            fontSize: FONT_SIZE,
            bold: true,
          },
          { table: { widths: ["auto", "*", "*"], body: [ProposedHeaderText, ...preData1] } },
        ],
      ]
    }

    if (convertStringToKey(arr.name) === "security_offered") {
      return [
        [
          index + 1,
          {
            text: Parameters,
            fontSize: FONT_SIZE,
            bold: true,
          },
          [
            {
              text: `The firm is offering the following security against the credit facility proposed :`,
              fontSize: FONT_SIZE,
              margin: [10, 10, 10, 10],
            },
            {
              text: `Primary: ${data["security_offered"]["primary"]}`,
              fontSize: FONT_SIZE,
              bold: true,
              margin: [10, 10, 10, 10],
            },
            {
              text: `Collateral: ${data["security_offered"]["collateral"]}`,
              fontSize: FONT_SIZE,
              bold: true,
              margin: [10, 10, 10, 10],
            },
            { table: { widths: "*", body: transpose(preData1) } },
          ],
        ],
      ]
    }

    if (convertStringToKey(arr.name) === "guarantee") {
      return [
        [
          index + 1,
          {
            text: Parameters,
            fontSize: FONT_SIZE,
            bold: true,
          },
          [
            {
              text: `Personal Guarantee of the following persons:`,
              fontSize: FONT_SIZE,
              bold: true,
              margin: [2, 2, 2, 2],
            },
            {
              ol: preData1.map((arr: any) => {
                return {
                  text: `${arr[1].text}`,
                  fontSize: FONT_SIZE,
                  margin: [2, 2, 2, 2],
                }
              }),
            },
          ],
        ],
      ]
    }

    return [
      [
        index + 1,
        {
          text: Parameters,
          fontSize: FONT_SIZE,
          bold: true,
        },
        { table: { widths: ["auto", "*"], body: preData1 } },
      ],
    ]
  })
}

export const MSMEJsonTable = (datas: any) => {
  const preData = MSMETableData(datas, OrderedData)
  const data = {
    background: function () {
      return [
        {
          canvas: [
            { type: "line", x1: 5, y1: 5, x2: 590, y2: 5, lineWidth: 1 }, //Up line
            { type: "line", x1: 5, y1: 5, x2: 5, y2: 835, lineWidth: 1 }, //Left line
            { type: "line", x1: 5, y1: 835, x2: 590, y2: 835, lineWidth: 1 }, //Bottom line
            { type: "line", x1: 590, y1: 5, x2: 590, y2: 835, lineWidth: 1 }, //Rigth line
          ],
        },
      ]
    },
    header: [
      {
        image: logoURL,
        width: 110,
        height: 20,
        alignment: "right",
        margin: [24, 10, 0, 0],
      },
    ],
    // footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
    content: [
      {
        text: "Teaser",
        fontSize: 20,
        bold: true,
        alignment: "center",
        margin: [10, 10, 10, 10],
      },
      {
        table: {
          widths: [20, 70, "*"],
          body: [
            [
              { text: "S. No.", bold: true, fontSize: 12 },
              { text: "Key Parameters", bold: true, fontSize: 12 },
              { text: "Particulars", bold: true, fontSize: 12 },
            ],
            ...preData,
          ],
        },
      },
    ],
    defaultStyle: {
      fontSize: 10,
      font: "DDIN",
    },
  }

  return data
}
export const RetailsJsonTable = (datas: any) => {
  const table: any[] = []

  datas.teasers.forEach((arr: any, i: number) => {
    const preData = MSMETableData(arr, RetailOrderedData)

    table.push([
      {
        text: i === 0 ? `APPLICANT DETAILS :` : `CO-APPLICANT ${i} DETAILS:`,
        fontSize: 18,
        bold: true,
        //[left, top, right, bottom]
        margin: [0, 5, 0, 5],
      },
      {
        table: {
          widths: [20, 70, "*"],
          body: [["S. No.", "Key Parameters", "Particulars"], ...preData],
        },
      },
    ])
  })
  const data = {
    background: function () {
      return [
        {
          canvas: [
            { type: "line", x1: 5, y1: 5, x2: 590, y2: 5, lineWidth: 1 }, //Up line
            { type: "line", x1: 5, y1: 5, x2: 5, y2: 835, lineWidth: 1 }, //Left line
            { type: "line", x1: 5, y1: 835, x2: 590, y2: 835, lineWidth: 1 }, //Bottom line
            { type: "line", x1: 590, y1: 5, x2: 590, y2: 835, lineWidth: 1 }, //Rigth line
          ],
        },
      ]
    },
    header: [
      {
        image: logoURL,
        width: 110,
        height: 20,
        alignment: "right",
        margin: [24, 10, 0, 0],
      },
    ],
    // footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
    content: [
      {
        text: "Teaser",
        fontSize: 20,
        bold: true,
        alignment: "center",
        margin: [10, 10, 10, 10],
      },
      table,
    ],
    defaultStyle: {
      fontSize: 10,
      font: "DDIN",
    },
  }

  return data
}

// export const RetailWordJsonTable = (datas: any, Image: any) => {
//   const table: any[] = []

//   datas.teasers.forEach((arr: any, i: number) => {
//     const preData = MSMETableWordData(arr, RetailOrderedData)

//     const oneTable = [
//       new Paragraph({
//         alignment: AlignmentType.LEFT,
//         children: [
//           new TextRun({
//             text: i === 0 ? `APPLICANT DETAILS :` : `CO-APPLICANT ${i} DETAILS:`,
//             bold: true,
//             size: 32,
//             color: "#000000",
//           }),
//         ],
//       }),
//       new Table({
//         columnWidths: [1000, 2000, 8000],
//         rows: [
//           new TableRow({
//             tableHeader: true,
//             children: [
//               new TableCell({
//                 children: [new Paragraph("S. No.")],
//               }),
//               new TableCell({
//                 children: [new Paragraph("Key Parameters")],
//               }),
//               new TableCell({
//                 children: [new Paragraph("Particulars")],
//               }),
//             ],
//           }),
//           ...preData,
//         ],
//       }),
//     ]

//     table.push(oneTable)
//   })
//   const doc: Document = new Document({
//     sections: [
//       {
//         properties: {
//           page: {
//             margin: {
//               bottom: 150,
//               left: 150,
//               right: 150,
//               top: 150,
//             },
//             borders: {
//               pageBorderLeft: {
//                 style: BorderStyle.SINGLE,
//                 size: 3,
//                 color: "auto",
//                 space: 1,
//               },
//               pageBorderRight: {
//                 style: BorderStyle.SINGLE,
//                 size: 3,
//                 color: "auto",
//                 space: 1,
//               },
//               pageBorderTop: {
//                 style: BorderStyle.SINGLE,
//                 size: 3,
//                 color: "auto",
//                 space: 1,
//               },
//               pageBorderBottom: {
//                 style: BorderStyle.SINGLE,
//                 size: 3,
//                 color: "auto",
//                 space: 1,
//               },
//             },
//           },
//         },
//         headers: {
//           default: new Header({
//             children: [
//               new Paragraph({
//                 children: [Image],
//               }),
//             ],
//           }),
//         },
//         children: [
//           new Paragraph({
//             alignment: AlignmentType.CENTER,
//             children: [
//               new TextRun({
//                 text: "Teaser",
//                 bold: true,
//                 size: 32,
//                 color: "#000000",
//               }),
//             ],
//           }),
//           ...table,
//         ],
//       },
//     ],
//   })

//   return doc
// }

// ============================================ RETAIL ======================================================

// export const MSMETableWordData = (data: any, ordereddata: any) => {
//   return ordereddata.flatMap((arr: any, index: any) => {
//     if (!data) {
//       return []
//     }

//     // ADDRESS
//     if (arr.key === "reg_address") {
//       return [
//         new TableRow({
//           children: [
//             new TableCell({
//               children: [new Paragraph(index + 1)],
//             }),
//             new TableCell({
//               children: [new Paragraph(arr.name)],
//             }),
//             new TableCell({
//               children: [
//                 new Paragraph(
//                   `${data["house_no"] ?? ""},  ${data["street"] ?? ""},  ${data["city"] ?? ""}, ${
//                     data["state"] ?? ""
//                   }, ${data["pincode"] ?? ""}`
//                 ),
//               ],
//             }),
//           ],
//         }),
//       ]
//     }

//     // financial_summary
//     if (arr.key === "financial_summary") {
//       let years = MSMETeaseData.summary.slice(0, 5).map((arr) => {
//         if (!data[convertStringToKey(arr.name)]) {
//           return [{ text: arr.name, fontSize: FONT_SIZE, bold: true }, ...["-", "-", "-", "-"]]
//         }

//         const datavalue = Object.values(data[convertStringToKey(arr.name)])
//         const preData3 = datavalue.map((arr) => {
//           return { text: arr, fontSize: FONT_SIZE }
//         })

//         if (preData3.length < 4) {
//           const filledNeeded = Array(4 - preData3.length).fill("-")
//           filledNeeded.forEach((arr) => {
//             preData3.push(arr)
//           })
//         }

//         return [{ text: arr.name, fontSize: FONT_SIZE, bold: true }, ...preData3]
//       })

//       // half year
//       const halfYear = MSMETeaseData.summary.slice(5).map((arr) => {
//         if (!data[convertStringToKey(arr.name)]) {
//           return [{ text: arr.name, fontSize: FONT_SIZE, bold: true }, ...["-", "-", "-", "-"]]
//         }

//         const preData3 = Object.values(data[convertStringToKey(arr.name)]).map((arr) => [
//           { text: arr, fontSize: FONT_SIZE },
//         ])

//         if (preData3.length !== 5) {
//           const filledNeeded = Array(5 - preData3.length).fill("-")
//           filledNeeded.forEach((arr) => {
//             preData3.push(arr)
//           })
//         }

//         return [{ text: arr.name, fontSize: FONT_SIZE, bold: true }, ...preData3]
//       })

//       return [
//         [
//           index + 1,
//           { text: arr.name, fontSize: FONT_SIZE, bold: true },
//           [
//             {
//               text: `M/s. ${data["financial_summary"] ?? "___________"} (ITR details) :`,
//               fontSize: FONT_SIZE,
//               bold: true,
//               margin: [10, 10, 10, 10],
//             },
//             {
//               table: {
//                 widths: ["auto", "*", "*", "*", "*"],
//                 body: [
//                   [
//                     ...YearHeader.map((arr) => {
//                       return {
//                         text: arr,
//                         fontSize: FONT_SIZE,
//                         bold: true,
//                       }
//                     }),
//                   ],
//                   ...years,
//                 ],
//               },
//             },
//             {
//               text: `Mr./Mrs. ${data["financial_summary1"] ?? "___________"}`,
//               fontSize: FONT_SIZE,
//               bold: true,
//               margin: [10, 10, 10, 10],
//             },
//             {
//               table: {
//                 widths: ["auto", "*", "*", "*", "*"],
//                 body: [
//                   [
//                     ...YearHeader.map((arr) => {
//                       return {
//                         text: arr,
//                         fontSize: FONT_SIZE,
//                         bold: true,
//                       }
//                     }),
//                   ],
//                   ...halfYear,
//                 ],
//               },
//             },
//           ],
//         ],
//       ]
//     }

//     // NULL

//     if (!data[arr.key] || (data[arr.key] && data[arr.key].length === 0)) {
//       return []
//     }

//     if (typeof data[arr.key] === "string") {
//       // Normal string
//       return [
//         [
//           index + 1,
//           { text: arr.name, fontSize: FONT_SIZE, bold: true },
//           { text: data[arr.key], fontSize: FONT_SIZE },
//         ],
//       ]
//     }

//     // NESTED TABLE
//     const preData1 = Object.entries<string>(data[arr.key]).map((Nestarr, i) => {
//       let name = Nestarr[1]

//       if (Nestarr[0] === "type_of_loan") {
//         name = client_service_options[Nestarr[1]]
//       }

//       if (convertStringToKey(arr.name) === "proposed_facilities") {
//         return [
//           { text: i + 1, fontSize: FONT_SIZE },
//           { text: dataObject[Nestarr[0]] ?? Nestarr[0], fontSize: FONT_SIZE, bold: true },
//           { text: name, fontSize: FONT_SIZE },
//         ]
//       }
//       return [
//         { text: dataObject[Nestarr[0]] ?? Nestarr[0], fontSize: FONT_SIZE, bold: true },
//         { text: name, fontSize: FONT_SIZE },
//       ]
//     })

//     const Parameters = dataObject[convertStringToKey(arr.name)] ?? arr.name

//     if (convertStringToKey(arr.name) === "existing_facilities") {
//       return [
//         [
//           index + 1,
//           {
//             text: Parameters,
//             fontSize: FONT_SIZE,
//             bold: true,
//           },
//           [
//             {
//               text: `Proprietor __________ has availed the following Financial facilities:`,
//               fontSize: FONT_SIZE,
//               bold: true,
//               margin: [10, 10, 10, 10],
//             },
//             { table: { widths: ["auto", "*"], body: preData1 } },
//           ],
//         ],
//       ]
//     }

//     if (convertStringToKey(arr.name) === "proposed_facilities") {
//       return [
//         [
//           index + 1,
//           {
//             text: Parameters,
//             fontSize: FONT_SIZE,
//             bold: true,
//           },
//           { table: { widths: ["auto", "*", "*"], body: [ProposedHeaderText, ...preData1] } },
//         ],
//       ]
//     }

//     if (convertStringToKey(arr.name) === "security_offered") {
//       return [
//         [
//           index + 1,
//           {
//             text: Parameters,
//             fontSize: FONT_SIZE,
//             bold: true,
//           },
//           [
//             {
//               text: `The firm is offering the following security against the credit facility proposed :`,
//               fontSize: FONT_SIZE,
//               margin: [10, 10, 10, 10],
//             },
//             {
//               text: `Primary: ${data["security_offered"]["primary"]}`,
//               fontSize: FONT_SIZE,
//               bold: true,
//               margin: [10, 10, 10, 10],
//             },
//             {
//               text: `Collateral: ${data["security_offered"]["collateral"]}`,
//               fontSize: FONT_SIZE,
//               bold: true,
//               margin: [10, 10, 10, 10],
//             },
//             { table: { widths: "*", body: transpose(preData1) } },
//           ],
//         ],
//       ]
//     }

//     if (convertStringToKey(arr.name) === "guarantee") {
//       return [
//         [
//           index + 1,
//           {
//             text: Parameters,
//             fontSize: FONT_SIZE,
//             bold: true,
//           },
//           [
//             {
//               text: `Personal Guarantee of the following persons:`,
//               fontSize: FONT_SIZE,
//               bold: true,
//               margin: [2, 2, 2, 2],
//             },
//             {
//               ol: preData1.map((arr: any) => {
//                 return {
//                   text: `${arr[1].text}`,
//                   fontSize: FONT_SIZE,
//                   margin: [2, 2, 2, 2],
//                 }
//               }),
//             },
//           ],
//         ],
//       ]
//     }

//     return [
//       [
//         index + 1,
//         {
//           text: Parameters,
//           fontSize: FONT_SIZE,
//           bold: true,
//         },
//         { table: { widths: ["auto", "*"], body: preData1 } },
//       ],
//     ]
//   })
// }
