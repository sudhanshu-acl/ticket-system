export async function getTickets() {
    try {
        const response = await fetch('/api/ticket');
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.log("Error fetching tickets", error);
        return [];
    }
}