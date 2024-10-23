import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClientService } from '../client.service';
import { AuthService } from '../../auth/auth.service';
import { defaultRoutes } from '../../auth/default.routes';
import { ConfirmPlanComponent } from './confirm-plan/confirm-plan.component';
import { Plan } from './plan';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-select-plan',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDialogModule,
    CommonModule,
  ],
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.scss'],
})
export class SelectPlanComponent {
  selectPlanForm!: FormGroup;
  currentUrl = '';
  currentPlan: Plan | null = null;
  plans: Plan[] = [
    {
      id: 'emprendedor',
      title: $localize`:@@planEmprendedorTitle:Emprendedor`,
      price: $localize`:@@planEmprendedorPrice:$21,000`,
      features: [
        $localize`:@@planFeaturePersonalSupport:Atención telefónica personalizada de soporte para tus clientes.`,
        $localize`:@@planFeatureSpecializedAgents:Agentes especializados que registran cada incidente.`,
        $localize`:@@planFeatureIncidentEscalation:Automatización del escalamiento de incidentes.`,
        $localize`:@@planFeatureRealTimeBoards:Tableros de control en tiempo real.`,
        $localize`:@@planFeatureAutomaticNotifications:Notificaciones automáticas al resolver incidentes.`,
        $localize`:@@planFeatureWebApplication:Consulta y registro por aplicación web.`,
        $localize`:@@planFeatureContinuousMonitoring:Monitoreo continuo para detectar situaciones urgentes.`,
      ],
      headerClass: 'entrepreneur',
    },
    {
      id: 'empresario',
      title: $localize`:@@planEmpresarioTitle:Empresario`,
      price: $localize`:@@planEmpresarioPrice:$27,000`,
      features: [
        $localize`:@@planFeatureAllFromEmprendedor:Todo lo del plan Emprendedor.`,
        $localize`:@@planFeatureMultipleChannels:Múltiples canales de contacto: teléfono, chatbot, app móvil, correo.`,
        $localize`:@@planFeatureOutboundCalls:Llamadas de salida para encuestas de satisfacción y ventas.`,
        $localize`:@@planFeatureAdvancedDashboards:Tableros avanzados para analizar operaciones y objetivos.`,
      ],
      headerClass: 'businessman',
    },
    {
      id: 'empresario_plus',
      title: $localize`:@@planEmpresarioPlusTitle:Empresario +`,
      price: $localize`:@@planEmpresarioPlusPrice:$34,000`,
      features: [
        $localize`:@@planFeatureAllFromEmpresario:Todo lo del plan Empresario.`,
        $localize`:@@planFeaturePredictiveAnalytics:Analítica predictiva para PQRs.`,
        $localize`:@@planFeatureRiskAnalysis:Análisis de riesgo basado en casos previos.`,
        $localize`:@@planFeatureKeyMonitoring:Monitoreo de indicadores clave de satisfacción.`,
      ],
      headerClass: 'businessmanplus',
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly clientService: ClientService,
    private readonly dialog: MatDialog,
    private readonly snackbarService: SnackbarService,
  ) {
    this.currentUrl = this.router.url;
    if (this.currentUrl === '/admin/change-plan') {
      this.clientService.loadClientData().subscribe({
        next: data => {
          if (data) {
            this.currentPlan = this.plans.find(plan => plan.id === data.plan) || null;
          }
        },
        error: err => {
          this.snackbarService.showError(err);
        },
      });
    }
  }

  handlePlanSelection(planId: string, planName: string, price: string): void {
    if (this.currentUrl === '/admin/change-plan') {
      this.openDialog(planId, planName, price);
    } else {
      this.savePlan(planId);
    }
  }

  openDialog(planId: string, planName: string, planPrice: string): void {
    const dialogRef = this.dialog.open(ConfirmPlanComponent, {
      width: '400px',
      data: {
        currentPlan: this.currentPlan?.title,
        newPlan: planName,
        newPrice: planPrice,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.savePlan(planId);
      }
    });
  }

  savePlan(planName: string) {
    this.clientService.savePlan(planName).subscribe(success => {
      if (success) {
        const role = this.authService.getRole();
        if (role !== null) {
          this.router.navigate([defaultRoutes[role]]);
        }
      }
    });
  }

  trackByPlanId(index: number, plan: Plan): string {
    return plan.id;
  }
}
