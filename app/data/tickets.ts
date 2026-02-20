import { IncidentTicket } from './dummy';

export const sampleTickets: IncidentTicket[] = [
  {
    ticketId: "TKT-001",
    title: "Server downtime issue",
    description: "Production server is not responding",
    category: "Infrastructure",
    priority: "Critical",
    impact: "High",
    urgency: "High",
    status: "Open",
    reportedBy: {
      userId: "U001",
      name: "John Doe",
      email: "john@example.com",
      department: "Engineering"
    },
    environment: {
      region: "us-east-1",
      service: "AWS EC2",
      version: "v2.1.0"
    },
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    ticketId: "TKT-002",
    title: "Unable to access dashboard",
    description: "Getting 403 error when accessing admin dashboard",
    category: "Access Management",
    priority: "High",
    impact: "Medium",
    urgency: "High",
    status: "In Progress",
    reportedBy: {
      userId: "U002",
      name: "Jane Smith",
      email: "jane@example.com",
      department: "Sales"
    },
    createdAt: "2024-01-14T14:20:00Z"
  },
  {
    ticketId: "TKT-003",
    title: "Software update request",
    description: "Need to update Node.js to latest version",
    category: "Software",
    priority: "Medium",
    impact: "Low",
    urgency: "Medium",
    status: "Open",
    reportedBy: {
      userId: "U003",
      name: "Mike Johnson",
      email: "mike@example.com",
      department: "Development"
    },
    createdAt: "2024-01-13T09:15:00Z"
  },
  {
    ticketId: "TKT-004",
    title: "Cloud deployment failed",
    description: "CI/CD pipeline failing on production deployment",
    category: "Cloud & DevOps",
    priority: "High",
    impact: "High",
    urgency: "High",
    status: "Resolved",
    reportedBy: {
      userId: "U004",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      department: "DevOps"
    },
    environment: {
      region: "us-west-2",
      service: "Kubernetes",
      version: "v1.28.0"
    },
    createdAt: "2024-01-12T16:45:00Z"
  },
  {
    ticketId: "TKT-005",
    title: "Security vulnerability found",
    description: "Potential XSS vulnerability in login form",
    category: "Security",
    priority: "Critical",
    impact: "High",
    urgency: "High",
    status: "In Progress",
    reportedBy: {
      userId: "U005",
      name: "Tom Brown",
      email: "tom@example.com",
      department: "Security"
    },
    createdAt: "2024-01-11T11:00:00Z"
  }
];
