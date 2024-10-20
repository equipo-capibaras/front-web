import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  MatPaginatorIntl,
  PageEvent,
} from '@angular/material/paginator';
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
  pageSize = 5;
  pageIndex = 0;

  employeeRole: { [key: string]: string } = {
    analyst: $localize`:@@employeeRegisterOptionRoleOAnalista:Analítica`,
    agent: $localize`:@@employeeRegisterOptionRoleAgente:Agente`,
    admin: $localize`:@@employeeRegisterOptionRoleAdmin:Administrador`,
  };
  chipInfo: { [key: string]: { icon: string; text: string; cssClass: string } } = {
    accepted: {
      icon: 'check',
      text: $localize`:@@statusAccepted:Aceptada`,
      cssClass: 'page__chip--success',
    },
    pending: {
      icon: 'schedule',
      text: $localize`:@@statusPending:Pendiente`,
      cssClass: 'page__chip--warning',
    },
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit() {
    this.employeesList.paginator = this.paginator;
    this.paginator.page.subscribe((event: PageEvent) => {
      this.pageSize = event.pageSize;
      this.pageIndex = event.pageIndex;
      this.loadEmployees();
    });
  }

  loadEmployees() {
    this.clientService.loadClientEmployees(this.pageSize, this.pageIndex + 1).subscribe(data => {
      if (data?.employees) {
        this.employeesList.data = data.employees;
      }
    });
  }
}
