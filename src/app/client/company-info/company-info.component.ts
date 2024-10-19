import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-company-info',
  standalone: true,
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss'],
  imports: [MatIconModule],
})
export class CompanyInfoComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
