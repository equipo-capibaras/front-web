import { Employee } from '../employee/employee';

export interface Incident {
  id: string;
  name: string;
  channel: 'mobile' | 'web' | 'email';
  reportedBy: Employee;
  createdBy: Employee;
  assignedTo: Employee;
  history: IncidentHistory[];
}

export interface IncidentHistory {
  seq: number;
  date: string;
  action: 'created' | 'escalated' | 'closed' | 'AI_response';
  description: string;
}
