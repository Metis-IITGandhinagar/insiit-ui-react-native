import { useQuery } from "@tanstack/react-query";
import { homeService } from "../services/homeService";

export function useHome() {
    return useQuery({
        queryKey: ["home"],
        queryFn: homeService.getHomeData,
    });
}