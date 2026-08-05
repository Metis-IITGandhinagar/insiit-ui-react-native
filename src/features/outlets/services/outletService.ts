import {apiClient} from "@/core/api/apiClient";
import { Outlet } from "./outletTypes";

export const outletService = {
    async getAllOutlets(): Promise<Outlet[]> {
        const { data } = await apiClient.get("/outlets");
        return data;
    },

    async getOutlet(id: number): Promise<Outlet> {
        const { data } = await apiClient.get(`/outlets/${id}`);
        return data;
    },
};