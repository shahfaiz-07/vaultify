import { useQuery } from "@tanstack/react-query"
import { getAllFiles } from "../../lib/api"

const useAllFiles = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['admin-files', 'all'],
        queryFn: getAllFiles,
    })

    return { allFiles: data?.files, isLoading }
}

export default useAllFiles;