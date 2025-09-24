// src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import {PrivateRouteProps} from '../interfaces/common'

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = sessionStorage.getItem("authToken");
 return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;