import { UserLoginComponent } from './user/user-login/user-login.component';
import { Routes } from '@angular/router';
import { EmployeeRegisterComponent } from './register/employee-register/employee-register.component';
import { CompanyRegisterComponent } from './register/company-register/company-register.component';

export const routes: Routes = [
  { path: '', component: UserLoginComponent },
  { path: 'employee-register', component: EmployeeRegisterComponent },
  { path: 'company-register', component: CompanyRegisterComponent },
];
