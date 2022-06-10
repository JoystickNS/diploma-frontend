import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { LECTURE } from "../../../constants/lessons";
import { IAnnotation } from "../../../models/IAnnotation";
import { IAttestation } from "../../../models/IAttestation";
import { IAttestationOnStudent } from "../../../models/IAttestationOnStudent";
import { IDelete } from "../../../models/IDelete";
import { IDictionary } from "../../../models/IDictionary";
import { IJournalFullInfo } from "../../../models/IJournalFullInfo";
import { ILesson } from "../../../models/ILesson";
import { IPoint } from "../../../models/IPoint";
import { IStartLesson } from "../../../models/IStartLesson";
import { IStudentSubgroup } from "../../../models/IStudentSubgroup";
import { ISubgroup } from "../../../models/ISubgroup";
import { IVisit } from "../../../models/IVisit";
import { sortLessonsByDate } from "../../../utils/general";
import {
  IJournalState,
  IStudentSubgroupAction,
  IVisitInProgress,
} from "./journal.interface";

const initialState: IJournalState = {
  id: -1,
  annotations: [],
  attestations: [],
  attestationsOnStudents: [],
  control: {} as IDictionary,
  controlOnStudents: [],
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
  visitsInProgress: [],
};

export const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    addAnnotationAction(state, action: PayloadAction<IAnnotation>) {
      const annotations = _.cloneDeep(state.annotations);

      annotations.push(action.payload);

      state.annotations = annotations;
    },

    addAttestationAction(state, action: PayloadAction<IAttestation>) {
      const attestations = _.cloneDeep(state.attestations);

      attestations.push(action.payload);

      state.attestations = attestations;
    },

    addAttestationOnStudentAction(
      state,
      action: PayloadAction<IAttestationOnStudent>
    ) {
      state.attestationsOnStudents = [
        ..._.cloneDeep(state.attestationsOnStudents),
        action.payload,
      ];
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

    addPointAction(state, action: PayloadAction<IPoint>) {
      state.points = [..._.cloneDeep(state.points), action.payload];
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

    addVisitInProgressAction(state, action: PayloadAction<IVisitInProgress>) {
      state.visitsInProgress = [
        ..._.cloneDeep(state.visitsInProgress),
        action.payload,
      ];
    },

    updateAnnotationAction(state, action: PayloadAction<IAnnotation>) {
      state.annotations = _.cloneDeep(state.annotations).map((annotation) =>
        annotation.id === action.payload.id ? action.payload : annotation
      );
    },

    updateAttestationAction(state, action: PayloadAction<IAttestation>) {
      state.attestations = _.cloneDeep(state.attestations).map((attestation) =>
        attestation.id === action.payload.id ? action.payload : attestation
      );
    },

    updateAttestationOnStudentAction(
      state,
      action: PayloadAction<IAttestationOnStudent>
    ) {
      state.attestationsOnStudents = _.cloneDeep(
        state.attestationsOnStudents
      ).map((attestationOnStudent) =>
        attestationOnStudent.attestationId === action.payload.attestationId &&
        attestationOnStudent.studentId === action.payload.studentId
          ? action.payload
          : attestationOnStudent
      );
    },

    updateLessonAction(state, action: PayloadAction<ILesson>) {
      state.lessons = _.cloneDeep(state.lessons)
        .map((lesson) =>
          lesson.id === action.payload.id ? action.payload : lesson
        )
        .sort(sortLessonsByDate);
    },

    updateManyLessonsAction(state, action: PayloadAction<ILesson[]>) {
      state.lessons = _.cloneDeep(state.lessons)
        .map((lesson) => {
          const foundLesson = action.payload.find(
            (updatedLesson) => updatedLesson.id === lesson.id
          );

          if (foundLesson) {
            return foundLesson;
          }

          return lesson;
        })
        .sort(sortLessonsByDate);
    },

    updatePointAction(state, action: PayloadAction<IPoint>) {
      state.points = _.cloneDeep(state.points).map((point) =>
        point.id === action.payload.id ? action.payload : point
      );
    },

    updateSubgroupStudentAction(
      state,
      action: PayloadAction<IStudentSubgroup>
    ) {
      const students = _.cloneDeep(state.students);

      for (let i = 0; i < students.length; i++) {
        if (students[i].id === action.payload.studentId) {
          students[i].subgroup = action.payload.subgroup;
          break;
        }
      }

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

    updateVisitAction(state, action: PayloadAction<IVisit>) {
      const visits = _.cloneDeep(state.visits);

      for (let i = 0; i < visits.length; i++) {
        if (
          visits[i].lessonId === action.payload.lessonId &&
          visits[i].studentId === action.payload.studentId
        ) {
          visits[i] = action.payload;
          break;
        }
      }

      state.visits = visits;
    },

    deleteAnnotationAction(state, action: PayloadAction<IDelete>) {
      state.annotations = _.cloneDeep(state.annotations).filter(
        (annotation) => annotation.id !== action.payload.id
      );

      state.points = _.cloneDeep(state.points).filter(
        (point) => point.annotationId !== action.payload.id
      );
    },

    deleteAttestationAction(state, action: PayloadAction<IDelete>) {
      state.attestations = _.cloneDeep(state.attestations).filter(
        (attestation) => attestation.id !== action.payload.id
      );
    },

    deleteLessonAction(state, action: PayloadAction<IDelete>) {
      state.lessons = _.cloneDeep(state.lessons).filter(
        (lesson) => lesson.id !== action.payload.id
      );
    },

    deletePointAction(state, action: PayloadAction<IDelete>) {
      state.points = _.cloneDeep(state.points).filter(
        (point) => point.id !== action.payload.id
      );
    },

    deleteSubgroupAction(state, action: PayloadAction<IDelete>) {
      const deletedLessons = state.lessons.filter((lesson) =>
        lesson.subgroups.every((subgroup) => subgroup.id === action.payload.id)
      );

      const deletedAnnotations = state.annotations.filter((annotation) =>
        deletedLessons.some((lesson) => lesson.id === annotation.lessonId)
      );

      const deletedVisits = state.visits.filter((visit) =>
        deletedLessons.some((lesson) => lesson.id === visit.lessonId)
      );

      state.annotations = _.cloneDeep(state.annotations).filter((annotation) =>
        deletedAnnotations.every(
          (deletedAnnotation) => deletedAnnotation.id !== annotation.id
        )
      );
      state.lessons = _.cloneDeep(state.lessons).filter((lesson) =>
        deletedLessons.every((deletedLesson) => deletedLesson.id !== lesson.id)
      );
      state.visits = _.cloneDeep(state.visits).filter((visit) =>
        deletedVisits.every(
          (deletedVisit) => deletedVisit.lessonId !== visit.lessonId
        )
      );
      state.subgroups = state.subgroups.filter(
        (subgroup) => subgroup.id !== action.payload.id
      );
    },

    deleteVisitInProgressAction(
      state,
      action: PayloadAction<IVisitInProgress>
    ) {
      state.visitsInProgress = _.cloneDeep(state.visitsInProgress).filter(
        (visitInProgress) =>
          visitInProgress.lessonId !== action.payload.lessonId &&
          visitInProgress.studentId !== action.payload.studentId
      );
    },

    setJournalAction(state, action: PayloadAction<IJournalFullInfo>) {
      state.id = action.payload.id;
      state.annotations = action.payload.annotations;
      state.attestations = action.payload.attestations;
      state.attestationsOnStudents = action.payload.attestationsOnStudents;
      state.control = action.payload.control;
      state.controlOnStudents = action.payload.controlOnStudents;
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

      for (let i = 0; i < students.length; i++) {
        if (students[i].id === studentId) {
          students[i].subgroup.subgroupNumber.value = value;
          break;
        }
      }

      state.students = students;
    },

    startLessonAction(state, action: PayloadAction<IStartLesson>) {
      const lessons = _.cloneDeep(state.lessons);

      for (let i = 0; i < lessons.length; i++) {
        if (lessons[i].id === action.payload.lessonId) {
          lessons[i].conducted = true;
          break;
        }
      }

      state.lessons = lessons;
      state.visits = [..._.cloneDeep(state.visits), ...action.payload.visits];
    },
  },
});

export const {
  addAnnotationAction,
  addAttestationAction,
  addAttestationOnStudentAction,
  addLessonAction,
  addManyLessonsAction,
  addPointAction,
  addSubgroupAction,
  addManySubgroupLessonsAction,
  addVisitInProgressAction,
  updateAnnotationAction,
  updateAttestationAction,
  updateAttestationOnStudentAction,
  updateLessonAction,
  updateManyLessonsAction,
  updatePointAction,
  updateSubgroupStudentAction,
  updateManySubgroupsStudentsAction,
  updateVisitAction,
  deleteAnnotationAction,
  deleteAttestationAction,
  deleteLessonAction,
  deletePointAction,
  deleteSubgroupAction,
  deleteVisitInProgressAction,
  setJournalAction,
  setStudentSubgroupAction,
  startLessonAction,
} = journalSlice.actions;
