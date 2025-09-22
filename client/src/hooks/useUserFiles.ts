import { useQuery } from "@tanstack/react-query"
import { getUserFiles } from "../lib/api"

const useUserFiles = () => {
    const { data, isPending } = useQuery({
        queryKey: ['user-files'],
        queryFn: getUserFiles,
    })

    return { files: data?.files, isPending };
}

export default useUserFiles