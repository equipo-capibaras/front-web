import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { CustomPaginatorIntl } from '../../pagination/pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatChipsModule, CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
})
export class EmployeeListComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'email', 'rol', 'invitation'];
  dataSource = new MatTableDataSource<Employee>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

export interface Employee {
  name: string;
  email: string;
  rol: string;
  invitation: string;
}

const ELEMENT_DATA: Employee[] = [
  {
    name: 'Maria Aristizabal',
    email: 'maria@empresa.com',
    rol: 'Administrador',
    invitation: 'Aceptada',
  },
  {
    name: 'Maria Aristizabal',
    email: 'maria@empresa.com',
    rol: 'Administrador',
    invitation: 'Aceptada',
  },
  {
    name: 'Maria Aristizabal',
    email: 'maria@empresa.com',
    rol: 'Administrador',
    invitation: 'Aceptada',
  },
  {
    name: 'Maria Aristizabal',
    email: 'maria@empresa.com',
    rol: 'Administrador',
    invitation: 'Pendiente',
  },
];
