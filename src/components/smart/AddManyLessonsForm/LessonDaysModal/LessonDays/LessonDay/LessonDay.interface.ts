import { Dispatch, SetStateAction } from "react";
import { ILessonDay } from "../LessonDays.interface";

export interface LessonDayProps {
  active: ILessonDay;
  setActive: Dispatch<SetStateAction<any>>;
}
