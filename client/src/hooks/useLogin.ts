import { useMutation, useQueryClient } from "@tanstack/react-query"
import { loginUser } from "../lib/api"
import toast from "react-hot-toast"
import { useNavigate } from "react-router"
import type { ApiError } from "../types"

const useLogin = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: loginUser,
        onSuccess: ( data ) => {
            console.log(data)
            toast.success(data.message || "Login successful!");
            queryClient.invalidateQueries({ queryKey: ['user']});
            navigate('/dashboard');
        },
        onError: ( error ) => {
            console.error("Login failed:", error);
            const apiError = error as ApiError;
            toast.error(apiError.response?.data.message || "Login failed. Please try again.");
        }
    })

    return { isPending, loginMutate: mutate }
}

export default useLogin;