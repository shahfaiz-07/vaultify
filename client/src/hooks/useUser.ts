import { useQuery } from "@tanstack/react-query"
import { getUser } from "../lib/api"

export const useUser = () => {
    const { data, isPending } = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: false,
    })
    return { user: data?.user, isPending }
}

export default useUser;