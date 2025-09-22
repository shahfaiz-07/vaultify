import { Navigate } from "react-router";
import Spinner from "../common/Spinner";
import useUser from "../../hooks/useUser";


type PrivateRouteProps = {
    children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {

  const { user, isPending } = useUser();

  if (isPending) return <Spinner />;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default PrivateRoute