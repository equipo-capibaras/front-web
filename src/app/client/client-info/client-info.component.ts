import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Client } from '../client';
import { ClientService } from '../client.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-client-info',
  standalone: true,
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss'],
  imports: [MatIconModule, CommonModule, RouterModule],
})
export class ClientInfoComponent implements OnInit {
  clientData: Client | null = null;
  clientPlan: Record<string, string> = {
    emprendedor: $localize`:@@planEmprendedorTitle:Emprendedor`,
    empresario: $localize`:@@planEmpresarioTitle:Empresario`,
    empresario_plus: $localize`:@@planEmpresarioPlusTitle:Empresario +`,
  };

  constructor(
    private readonly clientService: ClientService,
    private readonly snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.clientService.loadClientData(true).subscribe({
      next: data => {
        this.clientData = data;
      },
      error: err => {
        this.snackbarService.showError(err);
      },
    });
  }
}
