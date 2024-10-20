import { Role } from './auth/role';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { EmployeeRegisterComponent } from './employee/employee-register/employee-register.component';
import { DashboardComponent } from './analytics/dashboard/dashboard.component';
import { IncidentListComponent } from './incident/incident-list/incident-list.component';
import { EmployeeListComponent } from './client/employee-list/employee-list.component';
import { ClientRegisterComponent } from './client/client-register/client-register.component';
import { authGuard } from './auth/auth.guard';
import { SelectPlanComponent } from './select-plan/select-plan.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {
      showNavbar: false,
    },
  },
  {
    path: 'register',
    component: EmployeeRegisterComponent,
    data: {
      showNavbar: false,
    },
  },
  {
    path: 'client/register',
    component: ClientRegisterComponent,
    data: {
      showNavbar: false,
    },
  },
  {
    path: 'select-plan',
    component: SelectPlanComponent,
    data: {
      showNavbar: false,
    },
  },
  {
    path: 'admin',
    component: EmployeeListComponent,
    canActivate: [authGuard],
    data: {
      roles: [Role.Admin],
      showNavbar: true,
    },
  },
  {
    path: 'dashboards',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: {
      roles: [Role.Admin, Role.Analyst],
      showNavbar: true,
    },
  },
  {
    path: 'incidents',
    component: IncidentListComponent,
    canActivate: [authGuard],
    data: {
      roles: [Role.Admin, Role.Agent],
      showNavbar: true,
    },
  },
];
