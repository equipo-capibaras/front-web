import { EmployeeRegisterComponent } from './employee-register/employee-register.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { ChoosePlanComponent } from './choose-plan/choose-plan.component';

@NgModule({
  declarations: [EmployeeRegisterComponent, ChoosePlanComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    EmployeeRegisterComponent,
  ],
  providers: [],
  bootstrap: [],
})
export class AppModule {}
