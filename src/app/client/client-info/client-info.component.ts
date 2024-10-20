import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Client } from '../client';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-client-info',
  standalone: true,
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss'],
  imports: [MatIconModule],
})
export class ClientInfoComponent implements OnInit {
  clientData: Client | null = null;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.clientService.loadClientData();

    this.clientService.clientData$.subscribe(data => {
      this.clientData = data;
      console.log('Client Data:', this.clientData);
    });
  }
}
