import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { LECTURE } from "../../../constants/lessons";
import { IAttestation } from "../../../models/IAttestation";
import { IDictionary } from "../../../models/IDictionary";
import { IJournalFullInfo } from "../../../models/IJournalFullInfo";
import { ILesson } from "../../../models/ILesson";
import { IStudentSubgroup } from "../../../models/IStudentSubgroup";
import { ISubgroup } from "../../../models/ISubgroup";
import { sortLessonsByDate } from "../../../utils/general";
import { IStudentSubgroupAction } from "./journal.interface";

const initialState: IJournalFullInfo = {
  id: -1,
  attestations: [],
  control: {} as IDictionary,
  discipline: {} as IDictionary,
  group: {} as IDictionary,
  laboratoryHours: 0,
  lectureHours: 0,
  lessons: [],
  lessonTypes: [],
  lessonTopics: [],
  points: [],
  practiceHours: 0,
  semester: 0,
  students: [],
  subgroups: [],
  visits: [],
};

export const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    addAttestationAction(state, action: PayloadAction<IAttestation>) {
      const attestations = _.cloneDeep(state.attestations);

      attestations.push(action.payload);

      state.attestations = attestations;
    },

    addLessonAction(state, action: PayloadAction<ILesson>) {
      const lessons = _.cloneDeep(state.lessons);

      lessons.push(action.payload);
      lessons.sort(sortLessonsByDate);

      state.lessons = lessons;
    },

    addManyLessonsAction(state, action: PayloadAction<ILesson[]>) {
      state.lessons = [..._.cloneDeep(state.lessons), ...action.payload].sort(
        sortLessonsByDate
      );
    },

    addSubgroupAction(state, action: PayloadAction<ISubgroup>) {
      const lessons = _.cloneDeep(state.lessons);
      lessons.forEach((lesson) => {
        if (lesson.lessonType.name === LECTURE) {
          lesson.subgroups.push(action.payload);
        }
      });

      state.lessons = lessons;
      state.subgroups = [..._.cloneDeep(state.subgroups), action.payload];
    },

    addManySubgroupLessonsAction(state, action: PayloadAction<ILesson[]>) {
      state.lessons = [..._.cloneDeep(state.lessons), ...action.payload];
    },

    updateAttestationAction(state, action: PayloadAction<IAttestation>) {
      state.attestations = _.cloneDeep(state.attestations).map(
        (attestation) => {
          if (attestation.id === action.payload.id) {
            return action.payload;
          }

          return attestation;
        }
      );
    },

    updateLessonAction(state, action: PayloadAction<ILesson>) {
      state.lessons = _.cloneDeep(state.lessons)
        .map((lesson) => {
          if (lesson.id === action.payload.id) {
            return action.payload;
          }

          return lesson;
        })
        .sort(sortLessonsByDate);
    },

    updateManyLessonsAction(state, action: PayloadAction<ILesson[]>) {
      state.lessons = _.cloneDeep(state.lessons).map((lesson) => {
        const foundLesson = action.payload.find(
          (updatedLesson) => (updatedLesson.id = lesson.id)
        );

        if (foundLesson) {
          return foundLesson;
        }

        return lesson;
      });
    },

    updateSubgroupStudentAction(
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

    updateManySubgroupsStudentsAction(
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

    deleteAttestationAction(state, action: PayloadAction<number>) {
      state.attestations = _.cloneDeep(state.attestations).filter(
        (attestation) => attestation.id !== action.payload
      );
    },

    deleteLessonAction(state, action: PayloadAction<number>) {
      state.lessons = state.lessons.filter(
        (lesson) => lesson.id !== action.payload
      );
    },

    deleteSubgroupAction(state, action: PayloadAction<number>) {
      const deletedLessons = state.lessons.filter((lesson) =>
        lesson.subgroups.every((subgroup) => subgroup.id === action.payload)
      );

      const deletedPoints = state.points.filter((point) =>
        deletedLessons.some((lesson) => lesson.id === point.lessonId)
      );

      const deletedVisits = state.visits.filter((visit) =>
        deletedLessons.some((lesson) => lesson.id === visit.lessonId)
      );

      state.lessons = _.cloneDeep(state.lessons).filter((lesson) =>
        deletedLessons.every((deletedLesson) => deletedLesson.id !== lesson.id)
      );
      state.points = _.cloneDeep(state.points).filter((point) =>
        deletedPoints.every((deletedPoint) => deletedPoint.id !== point.id)
      );
      state.visits = _.cloneDeep(state.visits).filter((visit) =>
        deletedVisits.every((deletedVisit) => deletedVisit.id !== visit.id)
      );
      state.subgroups = state.subgroups.filter(
        (subgroup) => subgroup.id !== action.payload
      );
    },

    setJournalAction(state, action: PayloadAction<IJournalFullInfo>) {
      state.id = action.payload.id;
      state.attestations = action.payload.attestations;
      state.control = action.payload.control;
      state.discipline = action.payload.discipline;
      state.group = action.payload.group;
      state.laboratoryHours = action.payload.laboratoryHours;
      state.lectureHours = action.payload.lectureHours;
      state.lessons = action.payload.lessons;
      state.lessonTypes = action.payload.lessonTypes;
      state.lessonTopics = action.payload.lessonTopics;
      state.maximumPoints = action.payload.maximumPoints;
      state.points = action.payload.points;
      state.practiceHours = action.payload.practiceHours;
      state.semester = action.payload.semester;
      state.students = action.payload.students;
      state.subgroups = action.payload.subgroups;
      state.visits = action.payload.visits;
    },

    setStudentSubgroupAction(
      state,
      action: PayloadAction<IStudentSubgroupAction>
    ) {
      const { studentId, value } = action.payload;
      const students = _.cloneDeep(state.students);

      students.forEach((student) => {
        if (student.id === studentId) {
          student.subgroup.subgroupNumber.value = value;
        }
      });

      state.students = students;
    },
  },
});

export const {
  addAttestationAction,
  addLessonAction,
  addManyLessonsAction,
  addSubgroupAction,
  addManySubgroupLessonsAction,
  updateAttestationAction,
  updateLessonAction,
  updateManyLessonsAction,
  updateSubgroupStudentAction,
  updateManySubgroupsStudentsAction,
  deleteAttestationAction,
  deleteLessonAction,
  deleteSubgroupAction,
  setJournalAction,
  setStudentSubgroupAction,
} = journalSlice.actions;
