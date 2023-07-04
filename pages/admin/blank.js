import React from "react";

import { Col, Container, Row } from "reactstrap";

import Admin from "layouts/Admin";

const BlankPage = () => {
  return (
    <>
      <Container className="mt-4" fluid>
        <Row>
          <Col xl={10} style={{ height: 500 }}>
            Blank Page
          </Col>
        </Row>
      </Container>
    </>
  );
};

BlankPage.layout = Admin;

export default BlankPage;
