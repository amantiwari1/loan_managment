import React from "react"
import { PulseLoader } from "react-spinners"

const Loading = () => {
  return (
    <div className="grid place-items-center !w-full !h-full">
      <PulseLoader color="#242547" />
    </div>
  )
}

export default Loading
