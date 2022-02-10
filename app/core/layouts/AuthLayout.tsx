import { BlitzPage } from "blitz"
import { Col, Row } from "antd"

const LoginPage: BlitzPage = ({ children }) => {
  return (
    <div>
      <div>
        <div className="md:hidden grid place-items-center min-h-screen p-5">{children}</div>
      </div>
      <div className="hidden md:block">
        <Row>
          <Col span={10}>
            <div className="grid place-items-center min-h-screen px-2">{children}</div>
          </Col>
          <Col span={14}>
            <div
              className="min-h-screen bg-cover bg-no-repeat bg-center"
              style={{ backgroundImage: "url('/login-cover.jpg')" }}
            ></div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default LoginPage
