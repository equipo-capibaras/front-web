import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Client } from '../client';
import { ClientService } from '../client.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-info',
  standalone: true,
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss'],
  imports: [MatIconModule, CommonModule],
})
export class ClientInfoComponent implements OnInit {
  clientData: Client | null = null;

  constructor(private readonly clientService: ClientService) {}

  ngOnInit(): void {
    this.clientService.loadClientData().subscribe(data => {
      this.clientData = data;
    });
  }

  get formattedPlan(): string {
    if (this.clientData?.plan) {
      return (
        this.clientData.plan.charAt(0).toUpperCase() + this.clientData.plan.slice(1).toLowerCase()
      );
    }
    return '-';
  }
}
