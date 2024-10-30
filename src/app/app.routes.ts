import { Role } from './auth/role';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { EmployeeRegisterComponent } from './employee/employee-register/employee-register.component';
import { DashboardComponent } from './analytics/dashboard/dashboard.component';
import { IncidentListComponent } from './incident/incident-list/incident-list.component';
import { ClientRegisterComponent } from './client/client-register/client-register.component';
import { authGuard } from './auth/auth.guard';
import { SelectPlanComponent } from './client/select-plan/select-plan.component';
import { ClientManagementComponent } from './client/client-management/client-management.component';
import { EmployeeUnassignedComponent } from './employee/employee-unassigned/employee-unassigned.component';
import { IncidentRegisterComponent } from './incident/incident-register/incident-register.component';

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
    path: 'client/select-plan',
    component: SelectPlanComponent,
    data: {
      showNavbar: false,
    },
  },
  {
    path: 'unassigned',
    component: EmployeeUnassignedComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Agent, Role.Analyst], allowUnassigned: true, showNavbar: true },
  },
  {
    path: 'admin',
    component: ClientManagementComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Admin], showNavbar: true },
  },
  {
    path: 'admin/change-plan',
    component: SelectPlanComponent,
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
  {
    path: 'incident-register',
    component: IncidentRegisterComponent,
    canActivate: [authGuard],
    data: {
      roles: [Role.Admin, Role.Agent],
      showNavbar: true,
    },
  },
];
