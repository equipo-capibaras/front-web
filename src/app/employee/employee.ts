export interface Employee {
  id: string;
  clientId: string;
  name: string;
  email: string;
  role?: 'analyst' | 'agent' | 'admin';
  invitationStatus?: 'accepted' | 'pending';
  invitationDate?: string;
}
