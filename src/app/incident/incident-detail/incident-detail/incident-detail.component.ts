import { Component, OnInit } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { chipInfo } from '../../../shared/incident-chip';
import { CommonModule } from '@angular/common';
import { IncidentService } from '../../incident.service';
import { ActivatedRoute } from '@angular/router';
import { Incident, IncidentHistory } from '../../incident';

@Component({
  selector: 'app-incident-detail',
  templateUrl: './incident-detail.component.html',
  styleUrls: ['./incident-detail.component.scss'],
  imports: [MatChipsModule, CommonModule],
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
  isLoading = true;
  incidentChannelText = {
    web: $localize`:@@incidentWebChannel:Aplicación web`,
    mobile: $localize`:@@incidentMobileChannel:Aplicación móvil`,
    email: $localize`:@@incidentEmailChannel:Correo electrónico`,
  };

  constructor(
    private readonly incidentService: IncidentService,
    private readonly route: ActivatedRoute,
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
      this.isLoading = true;
      this.incidentService.incidentDetail(incidentId).subscribe(data => {
        if (data) {
          this.incidentDetail = data;
          this.incidentStatus = data.history[data.history.length - 1].action;
          this.incidentDescription = data.history[0].description;
          this.incidentCreatedDate = data.history[0].date;
          this.incidentEscalatedDate = this.getEscalatedDate(data.history);
          this.incidentClosedDate = this.getClosedDate(data.history);
          this.incidentHistory = data.history.slice(1);
          this.incidentChannel = data.channel;
          this.isLoading = false;
        }
      });
    }
  }
}
