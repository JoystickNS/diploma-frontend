import { FC } from "react";
import { Navigate } from "react-router-dom";
import {} from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";
import abilities from "../../../abilities/abilities";
import { useAppSelector } from "../../../hooks/redux";
import NoAccess from "../../../pages/NoAccess/NoAccess";
import { IRequireAuthProps } from "./RequireAuth.interface";

const RequireAuth: FC<IRequireAuthProps> = ({ requiredPermission }) => {
  const auth = useAppSelector((state) => state.auth);
  const location = useLocation();
  let hasPermission;

  if (!requiredPermission) {
    hasPermission = true;
  } else {
    hasPermission = abilities.can(
      requiredPermission.action,
      requiredPermission.subject
    );
  }

  return hasPermission ? (
    <Outlet />
  ) : auth.user ? (
    <NoAccess />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
