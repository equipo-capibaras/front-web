import { Employee } from '../../employee/employee';

export interface EmployeeListResponse {
  employees: Employee[];
  totalPages: number;
  currentPage: number;
  totalEmployees: number;
}
