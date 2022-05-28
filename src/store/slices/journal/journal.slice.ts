import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { IDictionary } from "../../../models/IDictionary";
import { IJournalFullInfo } from "../../../models/IJournalFullInfo";
import { IStudentSubgroup } from "../../../models/IStudentSubgroup";
import { ISubgroup } from "../../../models/ISubgroup";
import { IStudentSubgroupAction } from "./journal.interface";

const initialState: IJournalFullInfo = {
  id: -1,
  attestations: [],
  control: {} as IDictionary,
  discipline: {} as IDictionary,
  group: {} as IDictionary,
  laboratoryHours: 0,
  laboratoryTopics: [],
  lectureHours: 0,
  lectureTopics: [],
  lessons: [],
  practiceHours: 0,
  practiceTopics: [],
  semester: 0,
  students: [],
  subgroups: [],
};

export const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    addJournalSubgroup(state, action: PayloadAction<ISubgroup>) {
      const subgroups = _.cloneDeep(state.subgroups);

      state.subgroups = [...subgroups, action.payload];
    },

    updateJournalSubgroupStudent(
      state,
      action: PayloadAction<IStudentSubgroup>
    ) {
      const students = _.cloneDeep(state.students);
      students.forEach((student) => {
        if (student.id === action.payload.studentId) {
          student.subgroup = action.payload.subgroup;
        }
      });
      state.students = students;
    },

    updateManyJournalSubgroupsStudents(
      state,
      action: PayloadAction<IStudentSubgroup[]>
    ) {
      const students = _.cloneDeep(state.students);

      action.payload.forEach((studentSubgroup) => {
        for (let i = 0; i < students.length; i++) {
          if (students[i].id === studentSubgroup.studentId) {
            students[i].subgroup = studentSubgroup.subgroup;
            break;
          }
        }
      });

      state.students = students;
    },

    deleteJournalSubgroup(state, action: PayloadAction<number>) {
      state.subgroups = state.subgroups.filter(
        (subgroup) => subgroup.id !== action.payload
      );
    },

    setJournal(state, action: PayloadAction<IJournalFullInfo>) {
      state.id = action.payload.id;
      state.attestations = action.payload.attestations;
      state.control = action.payload.control;
      state.discipline = action.payload.discipline;
      state.group = action.payload.group;
      state.laboratoryHours = action.payload.laboratoryHours;
      state.laboratoryTopics = action.payload.laboratoryTopics;
      state.lectureHours = action.payload.lectureHours;
      state.lectureTopics = action.payload.lectureTopics;
      state.lessons = action.payload.lessons;
      state.maximumPoints = action.payload.maximumPoints;
      state.practiceHours = action.payload.practiceHours;
      state.practiceTopics = action.payload.practiceTopics;
      state.semester = action.payload.semester;
      state.students = action.payload.students;
      state.subgroups = action.payload.subgroups;
    },

    setStudentSubgroup(state, action: PayloadAction<IStudentSubgroupAction>) {
      const { studentId, value } = action.payload;
      const students = _.cloneDeep(state.students);
      students.forEach((student) => {
        if (student.id === studentId) {
          student.subgroup.number.value = value;
        }
      });
      state.students = students;
    },
  },
});

export const {
  addJournalSubgroup,
  updateJournalSubgroupStudent,
  updateManyJournalSubgroupsStudents,
  deleteJournalSubgroup,
  setJournal,
  setStudentSubgroup,
} = journalSlice.actions;
