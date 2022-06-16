import { Button, message } from "antd";
import { FC, useState } from "react";
import { useCSVReader } from "react-papaparse";
import { IImportStudentAndGroupArgs } from "../../../services/students/students.interface";
import { useImportStudentsAndGroupsMutation } from "../../../services/students/students.service";

export interface CSVReaderProps {
  setMessage: (value: string) => void;
}

export const CSVReader: FC<CSVReaderProps> = ({ setMessage }) => {
  const { CSVReader } = useCSVReader();

  const [isImportFetching, setIsImportFetching] = useState<boolean>(false);
  const [importStudentsAndGroupsAPI] = useImportStudentsAndGroupsMutation();

  return (
    <CSVReader
      onUploadAccepted={async (results: any) => {
        setIsImportFetching(true);
        const data: any[] = results.data;
        const resultsData: IImportStudentAndGroupArgs[] = [];
        for (let i = 1; i < data.length; i++) {
          const temp: IImportStudentAndGroupArgs =
            {} as IImportStudentAndGroupArgs;
          temp.id = data[i][0];
          temp.lastName = data[i][1].replace("*", "").trim();
          temp.firstName = data[i][2];
          temp.middleName = data[i][3];
          temp.group = data[i][4];
          temp.recordBookID = data[i][5];
          temp.passportID = data[i][6];
          temp.academ = data[i][7];
          temp.startYear = data[i][8];
          resultsData.push(temp);
        }

        const filteredResultData: IImportStudentAndGroupArgs[] = [];

        resultsData.forEach((item) => {
          const foundItem = filteredResultData.find(
            (filteredItem) => item.id === filteredItem.id
          );

          if (!foundItem) {
            filteredResultData.push(item);
          }
        });

        importStudentsAndGroupsAPI({ students: filteredResultData })
          .unwrap()
          .then(() => setMessage("Данные успешно импортированы"))
          .catch(() => setMessage("Произошла ошибка при импорте данных"))
          .finally(() => {
            setIsImportFetching(false);
          });
      }}
    >
      {({ getRootProps }: any) => (
        <>
          <div>
            <Button
              type="button"
              {...getRootProps()}
              loading={isImportFetching}
            >
              Импортировать студентов и группы
            </Button>
          </div>
        </>
      )}
    </CSVReader>
  );
};

export default CSVReader;
