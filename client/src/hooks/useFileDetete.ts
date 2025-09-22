import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFile } from "../lib/api";
import toast from "react-hot-toast";
import type { ApiError } from "../types";

const useFileDelete = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteFile,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['user-files'] });
            queryClient.invalidateQueries({ queryKey: ['file-stats'] });
            toast.success(data.message || "File deleted successfully");
        },
        onError: (error) => {
            const apiError = error as ApiError;
            toast.error(apiError.response?.data.message || "Failed to delete file");
        }
    });

    return { fileDeleteMutate: mutate, isPending };
}
export default useFileDelete;