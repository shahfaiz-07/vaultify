import { useQuery } from "@tanstack/react-query"
import { getFileStats } from "../lib/api"

const useFileStats = (isFilesUploaded: boolean) => {
    const { data, isLoading } = useQuery({
        queryKey: ['file-stats'],
        queryFn: getFileStats,
        enabled: isFilesUploaded,
    })

    return { stats: data, isLoading };
}

export default useFileStats