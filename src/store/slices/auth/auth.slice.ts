import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuth } from "../../../models/IAuth";
import { IAuthState } from "./auth.interface";

const initialState: IAuthState = {
  user: null,
  accessToken: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAction(state, action: PayloadAction<IAuth>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    updateAccessTokenAction(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    logoutAction(state) {
      state.user = null;
      state.accessToken = "";
    },
  },
});

export const { loginAction, updateAccessTokenAction, logoutAction } =
  authSlice.actions;
