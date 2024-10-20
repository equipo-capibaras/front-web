export interface Employee {
  id: string;
  clientId: string;
  name: string;
  email: string;
  role: 'analyst' | 'agent' | 'admin';
  invitationStatus: string;
  invitationDate: string;
}
