export interface Invoice {
  billing_month: string;
  billing_year: number;
  client_id: string;
  client_name: string;
  due_date: string;
  client_plan: string;
  total_cost: number;
  fixed_cost: number;
  total_incidents: {
    web: number;
    mobile: number;
    email: number;
  };
  unit_cost_per_incident: {
    web: number;
    mobile: number;
    email: number;
  };
  total_cost_per_incident: {
    web: number;
    mobile: number;
    email: number;
  };
}
