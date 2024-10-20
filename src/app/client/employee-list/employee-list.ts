import { Employee } from 'src/app/employee/Employee';

export interface EmployeeListResponse {
  employees: Employee[];
  totalPages: Number;
  currentPage: Number;
}
