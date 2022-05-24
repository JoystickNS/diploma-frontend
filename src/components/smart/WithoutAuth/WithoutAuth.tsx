import { FC } from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../../hooks/redux";
import NotFound from "../../../pages/NotFound/NotFound";

const WithoutAuth: FC = () => {
  const auth = useAppSelector((state) => state.auth);
  return auth.user ? <NotFound /> : <Outlet />;
};

export default WithoutAuth;
