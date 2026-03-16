

export async function getUsers() {
    try {
        const response = await fetch('/api/user');
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`[Error fetching users] Error fetching users`, error);
        return [];
    }
}