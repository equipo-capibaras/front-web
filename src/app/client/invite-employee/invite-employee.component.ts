import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-invite-employee',
  standalone: true,
  templateUrl: './invite-employee.component.html',
  styleUrls: ['./invite-employee.component.css'],
  imports: [MatButtonModule],
})
export class InviteEmployeeComponent {}
