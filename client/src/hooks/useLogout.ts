import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { logoutUser } from "../lib/api";

const useLogout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: logoutUser,
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['user']});
            navigate('/login');
        }
    })

    return { logoutMutate: mutate, isPending }
}
export default useLogout;