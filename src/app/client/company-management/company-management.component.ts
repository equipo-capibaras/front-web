import { Component, OnInit } from '@angular/core';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { CompanyInfoComponent } from '../company-info/company-info.component';

@Component({
  selector: 'app-company-management',
  standalone: true,
  templateUrl: './company-management.component.html',
  styleUrls: ['./company-management.component.css'],
  imports: [EmployeeListComponent, CompanyInfoComponent],
})
export class CompanyManagementComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
