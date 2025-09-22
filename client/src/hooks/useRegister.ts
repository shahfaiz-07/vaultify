import { useMutation } from "@tanstack/react-query"
import { registerUser } from "../lib/api"
import toast from "react-hot-toast"
import { useNavigate } from "react-router"
import type { ApiError } from "../types";


const useRegister = () => {
    const navigate = useNavigate();
    const { mutate, isPending, error } = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            toast.success(data.message || "Registration successful!");
            navigate('/login');
        },
        onError: (error) => {
            console.error("Registration failed:", error);
            const apiError = error as ApiError;
            toast.error(apiError.message || "Registration failed. Please try again.");
        }
    })

    return { isPending, registerMutate: mutate, error }
}

export default useRegister;