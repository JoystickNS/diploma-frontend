import "antd/dist/antd.min.css";
import { FC, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.scss";
import Preloader from "./components/simple/Preloader/Preloader";
import AppLayout from "./components/simple/AppLayout/AppLayout";
import RequireAuth from "./components/smart/RequireAuth/RequireAuth";
import WithoutAuth from "./components/smart/WithoutAuth/WithoutAuth";
import { ActionName, SubjectName } from "./constants/permissions";
import { RouteName } from "./constants/routes";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import Admin from "./pages/Admin/Admin";
import Auth from "./pages/Auth/Auth";
import Journals from "./pages/Journals/Journals";
import Main from "./pages/Main/Main";
import Reports from "./pages/Reports/Reports";
import { authAPI } from "./services/auth/auth.service";
import { initializeAction } from "./store/slices/app/app.slice";
import { loginAction } from "./store/slices/auth/auth.slice";
import "moment/locale/ru";
import moment from "moment";
import CreateJournalForm from "./components/smart/CreateJournalForm/CreateJournalForm";
import Journal from "./pages/Journals/Journal/Journal";

const App: FC = () => {
  const isAppInitialized = useAppSelector((state) => state.app.isInitialized);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    moment.locale("ru");

    dispatch(authAPI.endpoints.refresh.initiate())
      .unwrap()
      .then((refreshPayload) => {
        dispatch(authAPI.endpoints.me.initiate())
          .unwrap()
          .then((mePayload) => {
            dispatch(
              loginAction({
                user: mePayload,
                ...refreshPayload,
              })
            );
          })
          .catch((err) => console.error(err.data))
          .finally(() => {
            dispatch(initializeAction());
          });
      })
      .catch((err) => {
        dispatch(initializeAction());
      });
  }, []);

  return isAppInitialized ? (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* START Authorized routes */}

        {/* START Main */}
        <Route element={<RequireAuth />}>
          <Route path={RouteName.Main} element={<Main />} />
        </Route>
        {/* END Main */}

        {/* START Admin */}
        <Route
          element={
            <RequireAuth
              requiredPermission={{
                action: ActionName.Read,
                subject: SubjectName.Admin,
              }}
            />
          }
        >
          <Route path={RouteName.Admin} element={<Admin />} />
        </Route>
        {/* END Admin */}

        {/* START Journals */}
        <Route
          element={
            <RequireAuth
              requiredPermission={{
                action: ActionName.Read,
                subject: SubjectName.Journal,
              }}
            />
          }
        >
          <Route path={RouteName.Journals} element={<Journals />} />
          <Route
            path={`${RouteName.Journals}/:journalId`}
            element={<Journal />}
          />
          <Route
            path={`${RouteName.Journals}/create`}
            element={<CreateJournalForm />}
          />
        </Route>
        {/* END Journals */}

        {/* START Reports */}
        <Route
          element={
            <RequireAuth
              requiredPermission={{
                action: ActionName.Read,
                subject: SubjectName.Report,
              }}
            />
          }
        >
          <Route path={RouteName.Reports} element={<Reports />} />
        </Route>
        {/* START Reports */}

        {/* END Authorized routes */}

        {/* START Without Authorize Routes */}
        <Route element={<WithoutAuth />}>
          <Route path={RouteName.Login} element={<Auth />} />
          <Route
            path="*"
            element={
              <Navigate
                to={RouteName.Login}
                state={{ from: location }}
                replace
              />
            }
          />
        </Route>
        {/* END Without Authorize Routes */}
      </Route>
    </Routes>
  ) : (
    <Preloader />
  );
};

export default App;
