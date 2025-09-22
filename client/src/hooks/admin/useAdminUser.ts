import { useQuery } from "@tanstack/react-query"
import { getUserById } from "../../lib/api"

const useAdminUser = (userId: string) => {
    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'user', userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId,
    })

    return { userStat: data, isLoading }
}

export default useAdminUser;