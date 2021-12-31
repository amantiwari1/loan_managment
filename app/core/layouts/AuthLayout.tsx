import { BlitzPage } from "blitz"
import { Col, Row } from "antd"

const LoginPage: BlitzPage = ({ children }) => {
  return (
    <div>
      <Row>
        <Col span={8}>
          <div className="grid place-items-center min-h-screen">{children}</div>
        </Col>
        <Col span={16}>
          <div
            className="min-h-screen bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: "url('/login-cover.jpg')" }}
          ></div>
        </Col>
      </Row>
    </div>
  )
}

export default LoginPage
