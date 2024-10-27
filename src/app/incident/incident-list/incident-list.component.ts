import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatPaginator,
  MatPaginatorModule,
  MatPaginatorIntl,
  PageEvent,
} from '@angular/material/paginator';

import { CustomPaginatorIntl } from '../../pagination/pagination';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeService } from '../../employee/employee.service';

interface IncidentListEntry {
  name: string;
  user: string;
  filingDate: Date;
  status: string;
}

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
})
export class IncidentListComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['name', 'user', 'dateFiling', 'status', 'actions'];
  incidentsList = new MatTableDataSource<IncidentListEntry>();
  totalIncidents = 0;
  isLoading = true;

  chipInfo: Record<string, { icon: string; text: string; cssClass: string }> = {
    created: {
      icon: 'schedule',
      text: $localize`:@@incidentStatusOpen:Abierta`,
      cssClass: 'page__chip--blue',
    },
    escalated: {
      icon: 'warning',
      text: $localize`:@@incidentStatusEscalated:Escalado`,
      cssClass: 'page__chip--warning',
    },
    closed: {
      icon: 'check',
      text: $localize`:@@incidentStatusClosed:Cerrada`,
      cssClass: 'page__chip--success',
    },
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private readonly employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadIncidents(5, 1);
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe((event: PageEvent) => {
      this.loadIncidents(event.pageSize, event.pageIndex + 1);
    });
  }

  loadIncidents(pageSize: number, page: number) {
    this.isLoading = true;
    this.employeeService.loadIncidents(pageSize, page).subscribe(data => {
      if (data?.incidents) {
        this.incidentsList.data = data.incidents.map(incident => {
          return {
            name: incident.name,
            user: incident.reportedBy.email,
            filingDate: incident.filingDate,
            status: incident.status,
          };
        });
        this.totalIncidents = data.totalIncidents;
        this.isLoading = false;
      }
    });
  }
}
