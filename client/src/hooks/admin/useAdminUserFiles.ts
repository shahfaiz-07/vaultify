import { useQuery } from "@tanstack/react-query"
import { getFilesByUserId } from "../../lib/api"

const useAdminUserFiles = (userId: string) => {
    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'user-files', userId],
        queryFn: () => getFilesByUserId(userId),
        enabled: !!userId
    })

    return { userFiles: data?.files, isLoading }
}

export default useAdminUserFiles;