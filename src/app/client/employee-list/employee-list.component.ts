import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { CustomPaginatorIntl } from '../../pagination/pagination';
import { CommonModule } from '@angular/common';
import { ClientService } from '../client.service';
import { Employee } from 'src/app/employee/Employee';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatChipsModule, CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
})
export class EmployeeListComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'email', 'role', 'invitationStatus'];
  employeesList = new MatTableDataSource<Employee>();
  chipInfo: { [key: string]: { icon: string; text: string; cssClass: string } } = {
    accepted: {
      icon: 'check',
      text: 'Aceptada',
      cssClass: 'page__chip--success',
    },
    pending: {
      icon: 'schedule',
      text: 'Pendiente',
      cssClass: 'page__chip--warning',
    },
  };
  employeeRole: { [key: string]: string } = {
    analyst: 'Analista',
    agent: 'Agente',
    admin: 'Administrador',
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.clientService.loadClientEmployees();

    this.clientService.clientEmployees$.subscribe(data => {
      if (data?.employees) {
        this.employeesList.data = data.employees;
      }
    });
  }

  ngAfterViewInit() {
    this.employeesList.paginator = this.paginator;
  }
}
