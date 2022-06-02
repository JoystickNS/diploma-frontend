import { createSlice } from "@reduxjs/toolkit";
import { IAppState } from "./app.interface";

const initialState: IAppState = {
  isInitialized: false,
};

export const appSLice = createSlice({
  name: "app",
  initialState,
  reducers: {
    initializeAction(state) {
      state.isInitialized = true;
    },
  },
});

export const { initializeAction } = appSLice.actions;
