import { Component, OnInit } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { chipInfo } from '../../../shared/incident-chip';
import { IncidentService } from '../../incident.service';
import { LoadingService } from '../../../services/loading.service';
import { ActivatedRoute } from '@angular/router';
import { Incident, IncidentHistory } from '../../incident';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { finalize } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ChangeStatusComponent } from '../../change-status/change-status.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

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

  constructor(
    private readonly incidentService: IncidentService,
    private readonly route: ActivatedRoute,
    private readonly loadingService: LoadingService,
    private readonly snackbarService: SnackbarService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    const incidentId = this.route.snapshot.paramMap.get('id');
    this.getIncidentDetail(incidentId);
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

  getIncidentDetail(incidentId: string | null) {
    if (incidentId) {
      this.loadingService.setLoading(true);
      this.incidentService
        .incidentDetail(incidentId)
        .pipe(finalize(() => this.loadingService.setLoading(false)))
        .subscribe({
          next: data => {
            if (data) {
              this.incidentDetail = data;
              this.incidentStatus = data.history[data.history.length - 1].action;
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
          complete: () => {
            this.loadingService.setLoading(false);
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
