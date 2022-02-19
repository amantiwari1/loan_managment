import React from "react"
import { PulseLoader } from "react-spinners"

const Loading = () => {
  return (
    <div className="grid place-items-center   h-full">
      <PulseLoader color="#3182ce" />
    </div>
  )
}

export default Loading
