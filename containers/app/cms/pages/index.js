import React, { useState } from "react";
import { Col, Input, InputGroup, InputGroupAddon, Row } from "reactstrap";
import GroupList from "../components/GroupList";

function Home() {
  const [query, updateQuery] = useState("");
  return (
    <div className="container-fluid">
      <Row>
        <Col>
          <div className="search">
            <InputGroup>
              <InputGroupAddon addonType="append"> Search </InputGroupAddon>
              <Input
                onChange={e => updateQuery(e.target.value.toLocaleLowerCase())}
                value={query}
              />
            </InputGroup>
          </div>
          <GroupList search={query} />
        </Col>
      </Row>
      <style jsx>
        {`
          .search {
            margin: 20px;
            width: 500px;
          }
        `}
      </style>
    </div>
  );
}

export default Home;
