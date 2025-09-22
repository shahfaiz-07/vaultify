import { Navigate } from "react-router";
import Spinner from "../common/Spinner";
import useUser from "../../hooks/useUser";


type PublicRouteProps = {
    children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {

  const { user, isPending } = useUser();

  if (isPending) return <Spinner />;

  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}

export default PublicRoute