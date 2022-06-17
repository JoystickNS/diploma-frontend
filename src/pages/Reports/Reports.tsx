import { ExportOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Select, Spin, Table } from "antd";
import { FC, useState } from "react";
import { useAppDispatch } from "../../hooks/redux";
import { ISemesterGroupReport } from "../../models/ISemesterGroupReport";
import { useGetGroupsQuery } from "../../services/groups/groups.service";
import { reportsAPI } from "../../services/reports/reports.service";
import { rules } from "../../utils/rules";
import ExcelJS from "exceljs";
import {
  calculateExcelColumnsWidth,
  createBorderForCells,
  createOuterBorder,
  setAlignment,
} from "../../utils/excel";
import { saveAs } from "file-saver";

const { Option } = Select;

const Reports: FC = () => {
  const dispatch = useAppDispatch();

  const { data: groupsData, isLoading: isGroupsDataLoading } =
    useGetGroupsQuery();

  const [reportData, setReportData] = useState<ISemesterGroupReport>();
  const [isReportDataLoading, setIsReportDataLoading] =
    useState<boolean>(false);

  const handleExportToExcel = () => {
    if (!reportData) {
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Лист 1");

    // Информация о отчёте
    worksheet.getCell("A1").value = "Группа";
    worksheet.getCell("B1").value = reportData.group;
    worksheet.getCell("A2").value = "Семестр";
    worksheet.getCell("B2").alignment = { horizontal: "left" };
    worksheet.getCell("B2").value = reportData.semester;
    worksheet.getCell("A1").font = { bold: true };
    worksheet.getCell("A2").font = { bold: true };

    createBorderForCells(worksheet, { col: 1, row: 1 }, { col: 2, row: 2 });
    createOuterBorder(worksheet, { col: 1, row: 1 }, { col: 2, row: 2 });

    worksheet.addRow(null);

    // Шапка таблицы
    const header = ["№", "ФИО студента", "Дисциплины"];
    worksheet.addRow(header);

    // Выравнивание ФИО студента
    worksheet.getCell("B4").alignment = { horizontal: "center" };

    // Выравнивание Дисциплин
    worksheet.getCell("C4").alignment = { horizontal: "center" };

    // Объединение ячеек для №, ФИО студента и дисциплин
    worksheet.mergeCells(4, 1, 6, 1);
    worksheet.mergeCells(4, 2, 6, 2);
    worksheet.mergeCells(4, 3, 4, reportData.disciplines.length * 2 + 2);

    // Заполнение и выравнивание дисциплин
    reportData.disciplines.forEach((discipline, i) => {
      const col = i + 1;
      const left = col * 2 + 1;
      const cell = worksheet.getCell(5, left);
      cell.value = discipline.name;
      cell.alignment = { horizontal: "center" };
      worksheet.getCell(6, left).alignment = { horizontal: "center" };
      worksheet.getCell(6, left + 1).alignment = { horizontal: "center" };
      worksheet.getCell(6, left).value = "Пропуски (часов)";
      worksheet.getCell(6, left + 1).value = "Баллов";
      worksheet.mergeCells(5, left, 5, left + 1);
    });

    worksheet.getRow(4).font = { bold: true };
    worksheet.getRow(5).font = { bold: true };
    worksheet.getRow(6).font = { bold: true };

    reportData.students.forEach((student, studentIndex) => {
      const rowValues = [];

      const studentName = `${student.lastName} ${student.firstName} ${student.middleName}`;

      rowValues[0] = studentIndex + 1;
      rowValues[1] = studentName;

      student.performances.forEach((performance, performanceIndex) => {
        const col = performanceIndex + 1;
        const left = col * 2;

        rowValues[left] = performance.absenteeismCount * 2;
        rowValues[left + 1] = performance.pointsCount;
      });

      worksheet.addRow(rowValues);
    });

    // Выравнивание № студента
    setAlignment(worksheet, 1, 4, reportData.students.length + 6, {
      horizontal: "center",
    });

    // Выравнивание пропуском и баллов по центру
    reportData.disciplines.forEach((_, i) => {
      const col = (i + 1) * 2 + 1;
      setAlignment(worksheet, col, 7, reportData.students.length + 6, {
        horizontal: "center",
      });
      setAlignment(worksheet, col + 1, 7, reportData.students.length + 6, {
        horizontal: "center",
      });
    });

    calculateExcelColumnsWidth(worksheet);
    createBorderForCells(
      worksheet,
      { col: 1, row: 4 },
      {
        col: reportData.disciplines.length * 2 + 2,
        row: reportData.students.length + 6,
      }
    );

    createOuterBorder(
      worksheet,
      { col: 1, row: 4 },
      {
        col: reportData.disciplines.length * 2 + 2,
        row: reportData.students.length + 6,
      }
    );

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      saveAs(blob, `${reportData.group}_${reportData.semester}семестр.xlsx`);
    });
  };

  const onFinish = (values: any) => {
    setIsReportDataLoading(true);
    dispatch(
      reportsAPI.endpoints.getSemesterGroupReport.initiate({
        groupId: values.groupId,
        semester: values.semester,
      })
    )
      .unwrap()
      .then((data) => {
        setReportData(data);
      })
      .finally(() => setIsReportDataLoading(false));
  };

  const columns: any[] = [
    {
      title: "№",
      dataIndex: "studentNumber",
      fixed: "left",
      align: "center",
      width: "50px",
      responsive: ["md"],
    },
    {
      title: "ФИО студента",
      dataIndex: "studentName",
      fixed: "left",
      align: "center",
      width:
        window.screen.availWidth < 350
          ? "100px"
          : window.screen.availWidth > 350 && window.screen.availWidth < 500
          ? "200px"
          : "300px",
      sorter: (a: any, b: any) => (a.studentName > b.studentName ? 1 : -1),
      render: (text: string) => <div style={{ textAlign: "left" }}>{text}</div>,
    },
    {
      title: "Дисциплины",
      fixed: "left",
      align: "center",
      width: "200px",
      children: reportData?.disciplines.map((discipline, i) => ({
        key: i,
        title: discipline.name,
        children: [
          {
            title: "Пропуски (часов)",
            align: "center",
            dataIndex: `${discipline.id} absenteeismCount`,
          },
          {
            title: "Баллов",
            align: "center",
            dataIndex: `${discipline.id} pointsCount`,
          },
        ],
      })),
    },
  ];

  const dataSource = reportData?.students.map((student, i) => {
    const studentInfo: { [key: string]: number } = {};
    student.performances.forEach((performance) => {
      studentInfo[`${performance.disciplineId} absenteeismCount`] =
        performance.absenteeismCount * 2;
      studentInfo[`${performance.disciplineId} pointsCount`] =
        performance.pointsCount;
    });
    return {
      key: i,
      studentNumber: i + 1,
      studentName: `${student.lastName} ${student.firstName} ${student.middleName}`,
      ...studentInfo,
    };
  });

  return (
    <>
      <Row justify="center" align="middle" style={{ marginBottom: 24 }}>
        <Col span={24}>
          <h2 style={{ textAlign: "center", marginBottom: 24 }}>
            <strong>Формирование отчёта</strong>
          </h2>
        </Col>

        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="groupId"
              rules={[rules.required("Обязательное поле")]}
            >
              <Select
                showSearch
                placeholder="Выберите группу"
                loading={isGroupsDataLoading}
                optionFilterProp="label"
              >
                {groupsData?.map((group) => (
                  <Option key={group.id} value={group.id} label={group.name}>
                    {group.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="semester"
              rules={[rules.required("Обязательное поле")]}
            >
              <Select
                showSearch
                placeholder="Выберите семестр"
                loading={isGroupsDataLoading}
                optionFilterProp="label"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <Option key={i} value={i}>
                    {i}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Row justify="center">
              <Button
                type="primary"
                htmlType="submit"
                loading={isReportDataLoading}
              >
                Сформировать
              </Button>
            </Row>
          </Form>
        </Col>
      </Row>
      {reportData && (
        <>
          <Row align="top" gutter={[24, 0]} style={{ marginBottom: 12 }}>
            <Col>
              <h2>
                <strong>Группа: </strong>
                {false ? <Spin size="small" /> : reportData.group}
              </h2>
              <h2>
                <strong>Семестр: </strong>
                {false ? <Spin size="small" /> : reportData.semester}
              </h2>
              <Button
                icon={<ExportOutlined />}
                type="primary"
                onClick={handleExportToExcel}
              >
                Скачать отчёт
              </Button>
            </Col>
          </Row>
          <Table
            bordered
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            sticky
            scroll={{ x: "max-context", y: window.screen.availHeight - 300 }}
            size="small"
          ></Table>
        </>
      )}
    </>
  );
};

export default Reports;
