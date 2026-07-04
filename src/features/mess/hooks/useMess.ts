import { useQuery } from "@tanstack/react-query";

import { messService } from "../services/messService";

export function useMess() {
    return useQuery({
        queryKey: ["mess"],
        queryFn: () => messService.getMessData(),
    });
}