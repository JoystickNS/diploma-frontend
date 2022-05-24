import { configureStore } from "@reduxjs/toolkit";
import { api } from "../services/api";
import { appSLice } from "./slices/app/app.slice";
import { authSlice } from "./slices/auth/auth.slice";

export const store = configureStore({
  reducer: {
    app: appSLice.reducer,
    auth: authSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
