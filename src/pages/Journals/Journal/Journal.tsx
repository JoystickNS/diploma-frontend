import { Row, Spin } from "antd";
import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import JournalTable from "../../../components/smart/JournalTable/JournalTable";
import { useAppDispatch } from "../../../hooks/redux";
import { useGetJournalFullInfoQuery } from "../../../services/journals/journals.service";
import { setJournalAction } from "../../../store/slices/journal/journal.slice";
import NoAccess from "../../NoAccess/NoAccess";
import NotFound from "../../NotFound/NotFound";

const Journal: FC = () => {
  const dispatch = useAppDispatch();

  const { journalId } = useParams();

  const {
    data: JournalFullInfo,
    isLoading: isJournalFullInfoLoading,
    isSuccess: isJournalFullInfoSuccess,
    error: journalError,
  } = useGetJournalFullInfoQuery(journalId ? +journalId : 0);

  useEffect(() => {
    if (isJournalFullInfoSuccess) {
      dispatch(setJournalAction(JournalFullInfo));
    }
  }, [isJournalFullInfoLoading]);

  let errorCode;
  if (journalError && "status" in journalError) {
    errorCode = journalError.status;
  }

  switch (errorCode) {
    case 403:
      return <NoAccess />;

    case 404:
      return <NotFound />;
  }

  return isJournalFullInfoLoading ? (
    <Row justify="center">
      <Spin />
    </Row>
  ) : (
    <JournalTable />
  );
};

export default Journal;
