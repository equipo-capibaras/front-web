export const chipInfo: Record<string, { icon: string; text: string; cssClass: string }> = {
  created: {
    icon: 'schedule',
    text: $localize`:@@incidentStatusOpen:Abierta`,
    cssClass: 'page__chip--blue',
  },
  escalated: {
    icon: 'warning',
    text: $localize`:@@incidentStatusEscalated:Escalado`,
    cssClass: 'page__chip--warning',
  },
  closed: {
    icon: 'check',
    text: $localize`:@@incidentStatusClosed:Cerrada`,
    cssClass: 'page__chip--success',
  },
  accepted: {
    icon: 'check',
    text: $localize`:@@statusAccepted:Aceptada`,
    cssClass: 'page__chip--success',
  },
  pending: {
    icon: 'schedule',
    text: $localize`:@@statusPending:Pendiente`,
    cssClass: 'page__chip--warning',
  },
};
