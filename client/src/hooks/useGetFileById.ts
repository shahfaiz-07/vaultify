import { useQuery } from "@tanstack/react-query"
import { getFileById } from "../lib/api"

const useGetFileById = (fileId: string) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['file', fileId],
        queryFn: () => getFileById(fileId),
        enabled: !!fileId,
        retry: false,
    })

    return { file: data?.file, isLoading, isError, error }
}

export default useGetFileById;
