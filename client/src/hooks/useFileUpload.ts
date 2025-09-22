import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadFile } from "../lib/api"
import toast from "react-hot-toast";
import type { ApiError } from "../types";

const useFileUpload = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: uploadFile,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['user-files'] });
            queryClient.invalidateQueries({ queryKey: ['file-stats'] });
            toast.success(data.message || "File uploaded successfully");
        },
        onError: (error) => {
            const apiError = error as ApiError;
            toast.error(apiError.response?.data.message || "Failed to upload file");
        }
    })

    return { fileUploadMutate: mutate, isPending };
}

export default useFileUpload;