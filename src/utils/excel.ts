import ExcelJS, { Border } from "exceljs";

export const calculateExcelColumnsWidth = (worksheet: ExcelJS.Worksheet) => {
  worksheet.columns.forEach((column) => {
    if (column["eachCell"]) {
      let maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 3;
    }
  });
};

export const createOuterBorder = (
  worksheet: ExcelJS.Worksheet,
  start = { row: 1, col: 1 },
  end = { row: 1, col: 1 },
  borderWidth: Border = { style: "medium", color: { argb: "000" } }
) => {
  for (let i = start.row; i <= end.row; i++) {
    const leftBorderCell = worksheet.getCell(i, start.col);
    const rightBorderCell = worksheet.getCell(i, end.col);
    leftBorderCell.border = {
      ...leftBorderCell.border,
      left: borderWidth,
    };
    rightBorderCell.border = {
      ...rightBorderCell.border,
      right: borderWidth,
    };
  }

  for (let i = start.col; i <= end.col; i++) {
    const topBorderCell = worksheet.getCell(start.row, i);
    const bottomBorderCell = worksheet.getCell(end.row, i);
    topBorderCell.border = {
      ...topBorderCell.border,
      top: borderWidth,
    };
    bottomBorderCell.border = {
      ...bottomBorderCell.border,
      bottom: borderWidth,
    };
  }
};

export const createBorderForCells = (
  worksheet: ExcelJS.Worksheet,
  start = { col: 1, row: 1 },
  end = { col: 1, row: 1 },
  borderWidth: Border = { style: "thin", color: { argb: "000" } }
) => {
  for (let i = start.col; i <= end.col; i++) {
    for (let j = start.row; j <= end.row; j++) {
      worksheet.getCell(j, i).border = {
        bottom: borderWidth,
        left: borderWidth,
        right: borderWidth,
        top: borderWidth,
      };
    }
  }
};

export const setAlignment = (
  worksheet: ExcelJS.Worksheet,
  col: number,
  rowStart: number,
  rowEnd: number,
  alignment: Partial<ExcelJS.Alignment>
) => {
  for (let i = rowStart; i <= rowEnd; i++) {
    const cell = worksheet.getCell(i, col);
    cell.alignment = {
      ...cell.alignment,
      ...alignment,
    };
  }
};
