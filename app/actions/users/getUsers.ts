import logger from "@/app/lib/logger";

export async function getUsers() {
    try {
        const response = await fetch('/api/user');
        const data = await response.json();
        return data.data;
    } catch (error) {
        logger.error(`[Error fetching users] Error fetching users ${error}`)
        return [];
    }
}