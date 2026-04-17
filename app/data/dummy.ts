export type Priority = "Low" | "Medium" | "High" | "Critical";
export type Status = "Open" | "In Progress" | "Resolved" | "Closed";
export type category = "Infrastructure" | "Software" | "Access Management" | "Cloud & DevOps" | "Development Support" | "Security" | "HR / Admin IT Requests"// It follow solid principal as it can extended.. without code change.

export interface ReportedBy {
  userId: string;
  name: string;
  email: string;
  department: string;
}

export interface Environment {
  region: string;
  service: string;
  version: string;
}

export interface Attachment {
  fileName: string;
  fileUrl: string;
}

export interface IncidentTicket {
  _id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  priority: Priority;
  impact: string;
  urgency: string;
  status: Status;
  reportedBy: ReportedBy;
  environment?: Environment;
  createdAt: string;
  attachments?: Attachment[];
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
}