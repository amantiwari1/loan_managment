export const Th = ({ children }) => {
  return <th className=" border-[0.1px] border-black bg-gray-200">{children}</th>
}
export const Tr = ({ children }) => {
  return <tr>{children}</tr>
}
export const Td = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <td className={" border-[0.1px] border-black " + className}>{children}</td>
}
export const Table = ({ children }) => {
  return (
    <table className="table-auto border-collapse text-[0.6rem] w-full !py-4 ">{children}</table>
  )
}
