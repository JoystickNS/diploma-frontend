export interface LessonDaysProps {
  onCancel: () => void;
  onOk: (values: any) => void;
}

export interface ILessonSettings {
  isOnePerTwoWeeks: boolean;
  startWeek: number;
}

export interface ILessonDay {
  day?: "пн" | "вт" | "ср" | "чт" | "пт" | "сб";
  couplesCount: number;
  couples: ILessonSettings[];
  isActive: boolean;
}
