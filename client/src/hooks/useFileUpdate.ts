import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateFile } from "../lib/api"
import toast from "react-hot-toast";
import type { ApiError } from "../types";

const useFileUpdate = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: updateFile,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['user-files'] });
            queryClient.invalidateQueries({ queryKey: ['file-stats'] });
            toast.success(data.message || "File updated successfully");
        },
        onError: (error) => {
            const apiError = error as ApiError;
            toast.error(apiError.response?.data.message || "Failed to update file");
        }
    })
    return { fileUpdateMutate: mutate, isPending };
}

export default useFileUpdate;