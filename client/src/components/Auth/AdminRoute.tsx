import { Navigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "../../types";


type AdminRouteProps = {
    children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {

  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<{ user: User }>(['user']);


  if (!data || !data.user) return <Navigate to="/login" replace />;
  if (data.user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
}

export default AdminRoute