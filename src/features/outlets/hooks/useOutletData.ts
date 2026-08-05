import { useEffect, useState } from "react";
import { Outlet } from "../services/outletTypes";
import { outletService } from "../services/outletService";

export function useOutletData() {
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOutlets = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await outletService.getAllOutlets();
            setOutlets(data);
        } catch (e) {
            setError("Failed to load outlets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOutlets();
    }, []);

    return {
        outlets,
        loading,
        error,
        refresh: fetchOutlets,
    };
}