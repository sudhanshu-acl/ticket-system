/**
 * Helper functions for the bug tracking application.
 * This includes functions for determining CSS classes based on ticket properties.
 */

export const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'Critical': return 'bg-red-100 text-red-800';
        case 'High': return 'bg-orange-100 text-orange-800';
        case 'Medium': return 'bg-yellow-100 text-yellow-800';
        case 'Low': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

/** 
 * Status colors:
 * Open: Blue
 * In Progress: Purple
 * Resolved: Green
 * Closed: Gray
 */

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'Open': return 'bg-blue-100 text-blue-800';
        case 'In Progress': return 'bg-purple-100 text-purple-800';
        case 'Resolved': return 'bg-green-100 text-green-800';
        case 'Closed': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};
