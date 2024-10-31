import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
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
import { Employee } from '../../employee/employee';
import { chipInfo } from '../../shared/incident-chip';
import { LoadingService } from 'src/app/services/loading.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatChipsModule, CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
})
export class EmployeeListComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['name', 'email', 'role', 'invitationStatus'];
  employeesList = new MatTableDataSource<Employee>();
  totalEmployees = 0;
  chipInfo = chipInfo;

  employeeRole: Record<string, string> = {
    analyst: $localize`:@@employeeRegisterOptionRoleOAnalista:Analítica`,
    agent: $localize`:@@employeeRegisterOptionRoleAgente:Agente`,
    admin: $localize`:@@employeeRegisterOptionRoleAdmin:Administrador`,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly clientService: ClientService,
    private readonly loadingService: LoadingService,
    private readonly snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.loadEmployees(5, 1);
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe((event: PageEvent) => {
      this.loadEmployees(event.pageSize, event.pageIndex + 1);
    });
  }

  loadEmployees(pageSize: number, page: number) {
    this.loadingService.setLoading(true);
    this.clientService.loadClientEmployees(pageSize, page).subscribe({
      next: data => {
        if (data?.employees) {
          this.employeesList.data = data.employees;
          this.totalEmployees = data.totalEmployees;
        }
      },
      error: err => {
        this.snackbarService.showError(err);
      },
      complete: () => {
        this.loadingService.setLoading(false);
      },
    });
  }
}
