import { Role } from './auth/role';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './analytics/dashboard/dashboard.component';
import { IncidentListComponent } from './incident/incident-list/incident-list.component';
import { EmployeeListComponent } from './client/employee-list/employee-list.component';
import { authGuard } from './auth/auth.guard';

// Default routes for each role
export const defaultRoutes: { [key in Role]: string } = {
  [Role.Admin]: '/admin',
  [Role.Analyst]: '/dashboards',
  [Role.Agent]: '/incidents',
};

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'admin',
    component: EmployeeListComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Admin] },
  },
  {
    path: 'dashboards',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Admin, Role.Analyst] },
  },
  {
    path: 'incidents',
    component: IncidentListComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Admin, Role.Agent] },
  },
];
