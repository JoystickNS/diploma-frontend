import { Card, Col } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";
import { JournalCardProps } from "./JournalCard.interface";
import s from "./JournalCard.module.scss";

const JournalCard: FC<JournalCardProps> = ({
  id,
  discipline,
  group,
  user,
  semester,
}) => {
  return (
    <Col md={{ span: 12 }} lg={{ span: 6 }}>
      <Link to={String(id)}>
        <Card className={s.journalBtn} style={{ margin: 0 }}>
          <div>
            <strong>Дисциплина: </strong>
            {discipline}
          </div>
          <div>
            <strong>Группа: </strong>
            {group}
          </div>
          {user && (
            <div>
              <strong>Преподаватель: </strong>
              {`${user.lastName} ${user.firstName[0]}. ${user.middleName[0]}.`}
            </div>
          )}
          <div>
            <strong>Семестр: </strong>
            {semester}
          </div>
        </Card>
      </Link>
    </Col>
  );
};

export default JournalCard;
