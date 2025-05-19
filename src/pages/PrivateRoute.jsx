import { useNavigate } from "react-router-dom";
import useAuth from "../services/authService";

function PrivateRoute({ element: Component, roles, ...rest }) {
  const { role } = useAuth();
  const navigate = useNavigate();

  return roles.includes(role) ? (
    <Component {...rest} />
  ) : (
    navigate(-1) // Go back one step in history
  );
}

export default PrivateRoute;
