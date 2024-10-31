import { Component, OnInit } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { chipInfo } from '../../../shared/incident-chip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-incident-detail',
  templateUrl: './incident-detail.component.html',
  styleUrls: ['./incident-detail.component.scss'],
  imports: [MatChipsModule, CommonModule],
  standalone: true,
})
export class IncidentDetailComponent implements OnInit {
  chipInfo = chipInfo;

  constructor() {}

  ngOnInit() {}
}
