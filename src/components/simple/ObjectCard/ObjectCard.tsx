import { Card, Col } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";
import { ObjectCardProps } from "./ObjectCard.interface";
import s from "./ObjectCard.module.scss";

const ObjectCard: FC<ObjectCardProps> = ({ name, to }) => {
  return (
    <Col
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      lg={{ span: 8 }}
      style={{ width: "100%" }}
    >
      <Link to={to}>
        <Card className={s.object}>{name}</Card>
      </Link>
    </Col>
  );
};

export default ObjectCard;
