import { useQuery } from "@tanstack/react-query"
import { getAllUsers } from "../../lib/api"

const useAdminUsers = () => {
    const { data, isPending } = useQuery({
        queryKey: ['admin-users'],
        queryFn: getAllUsers,
    })

    return { users: data?.users, isPending }
}

export default useAdminUsers;