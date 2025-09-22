import { useQuery } from "@tanstack/react-query"
import { getStorageStats } from "../../lib/api"

const useStorageStats = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['admin-stat', 'storage'],
        queryFn: getStorageStats,
    })

    return { storageStats: data, isLoading }
}

export default useStorageStats;