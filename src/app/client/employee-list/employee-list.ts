import { Employee } from 'src/app/employee/Employee';

export interface EmployeeListResponse {
  employees: Employee[];
  totalPages: number;
  currentPage: number;
  totalEmployees: number;
}
