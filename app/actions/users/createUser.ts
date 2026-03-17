export async function createUser(email: string, name: string, role: string, jobTitle: string) {
    try {
        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password: 'Password123!', name, role, jobTitle }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to create user');
        }
        return data;
    } catch (error) {
        console.error(`[Error creating user] Error creating user`, error);
        throw error;
    }
}
