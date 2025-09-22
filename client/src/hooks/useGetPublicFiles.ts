import { useQuery } from "@tanstack/react-query"
import { getPublicFiles } from "../lib/api"

const useGetPublicFiles = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['public-files'],
        queryFn: getPublicFiles,
    })

    return { files: data?.files, isLoading }
}

export default useGetPublicFiles;