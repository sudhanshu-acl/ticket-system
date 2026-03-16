import logger from "@/app/lib/logger";

export async function updateUser(email: string, name: string, role: string, jobTitle: string) {
    try {
        const response = await fetch('/api/user', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name, role, jobTitle }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to update user');
        }
        return data;
    } catch (error) {
        logger.error(`[Error updating user] Error updating user ${error}`)
        throw error;
    }
}
