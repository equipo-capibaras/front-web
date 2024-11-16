import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { chipInfo } from '../../../shared/incident-chip';
import { IncidentService } from '../../incident.service';
import { LoadingService } from '../../../services/loading.service';
import { ActivatedRoute } from '@angular/router';
import { Incident, IncidentHistory } from '../../incident';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangeStatusComponent } from '../../change-status/change-status.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ClientService } from 'src/app/client/client.service';
import { finalize } from 'rxjs';
import { AIAsistenceDialogComponent } from '../ai-asistence-dialog/ai-asistence-dialog.component';

@Component({
  selector: 'app-incident-detail',
  templateUrl: './incident-detail.component.html',
  styleUrls: ['./incident-detail.component.scss'],
  imports: [CommonModule, MatChipsModule, MatButtonModule],
  standalone: true,
})
export class IncidentDetailComponent implements OnInit {
  chipInfo = chipInfo;
  incidentDetail: Incident | null = null;
  incidentStatus = '';
  incidentDescription = '';
  incidentCreatedDate = '';
  incidentEscalatedDate = '';
  incidentClosedDate = '';
  incidentChannel: 'web' | 'mobile' | 'email' = 'web';
  incidentHistory: IncidentHistory[] = [];
  incidentChannelText = {
    web: $localize`:@@incidentWebChannel:Aplicación web`,
    mobile: $localize`:@@incidentMobileChannel:Aplicación móvil`,
    email: $localize`:@@incidentEmailChannel:Correo electrónico`,
  };
  clientPlan: string | null = null;

  constructor(
    private readonly incidentService: IncidentService,
    private readonly clientService: ClientService,
    private readonly route: ActivatedRoute,
    private readonly loadingService: LoadingService,
    private readonly snackbarService: SnackbarService,
    public dialog: MatDialog,
    @Inject(LOCALE_ID) public locale: string,
  ) {}

  ngOnInit() {
    const incidentId = this.route.snapshot.paramMap.get('id');
    this.getClientInfo();
    this.getIncidentDetail(incidentId);
  }

  openAIAsistenceDialog(incidentId: string): void {
    this.incidentService.AISuggestions(incidentId, this.locale).subscribe({
      next: data => {
        if (data) {
          this.dialog.open(AIAsistenceDialogComponent, {
            autoFocus: false,
            restoreFocus: false,
            width: '800px',
            data: data,
          });
        }
      },
    });
  }

  getEscalatedDate(incidentHistory: IncidentHistory[]) {
    if (incidentHistory.length < 2) return '';
    const escalatedComments = incidentHistory.filter(comment => comment.action === 'escalated');
    return escalatedComments.length > 0 ? escalatedComments[escalatedComments.length - 1].date : '';
  }

  getClosedDate(incidentHistory: IncidentHistory[]) {
    const closedComment = incidentHistory.find(comment => comment.action === 'closed');
    return closedComment ? closedComment.date : '';
  }

  getClientInfo() {
    this.clientService.loadClientData(true).subscribe({
      next: data => {
        if (data) {
          this.clientPlan = data.plan ?? null;
        }
      },
    });
  }

  getIncidentDetail(incidentId: string | null) {
    if (incidentId) {
      this.loadingService.setLoading(true);
      this.incidentService
        .incidentDetail(incidentId)
        .pipe(finalize(() => this.loadingService.setLoading(false)))
        .subscribe({
          next: data => {
            if (data) {
              const last_action = data.history[data.history.length - 1].action;
              this.incidentDetail = data;
              this.incidentStatus =
                last_action === 'AI_response'
                  ? data.history[data.history.length - 2].action
                  : last_action;
              this.incidentDescription = data.history[0].description;
              this.incidentCreatedDate = data.history[0].date;
              this.incidentEscalatedDate = this.getEscalatedDate(data.history);
              this.incidentClosedDate = this.getClosedDate(data.history);
              this.incidentHistory = data.history.slice(1);
              this.incidentChannel = data.channel;
            }
          },
          error: err => {
            this.snackbarService.showError(err);
          },
        });
    }
  }

  openChangeStatusDialog(incidentId: string): void {
    const dialogRef = this.dialog.open(ChangeStatusComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: {
        incidentId,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getIncidentDetail(incidentId);
    });
  }
}
