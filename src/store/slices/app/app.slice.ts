import { createSlice } from "@reduxjs/toolkit";
import { IAppState } from "./app.interface";

const initialState: IAppState = {
  isInitialized: false,
};

export const appSLice = createSlice({
  name: "app",
  initialState,
  reducers: {
    initialize(state) {
      state.isInitialized = true;
    },
  },
});

export const { initialize } = appSLice.actions;
