import { Button, Card, Col } from "antd";
import { Meta } from "antd/lib/list/Item";
import { FC } from "react";
import { Link } from "react-router-dom";
import { ObjectCardProps } from "./ObjectCard.interface";

const ObjectCard: FC<ObjectCardProps> = ({ name, to }) => {
  return (
    <Col xs={{ span: 10 }} md={{ span: 6 }}>
      <Card>
        <Meta
          title={
            <Link to={to}>
              <Button type="link">{name}</Button>
            </Link>
          }
          style={{ textAlign: "center" }}
        ></Meta>
      </Card>
    </Col>
  );
};

export default ObjectCard;
