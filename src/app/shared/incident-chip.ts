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
    text: $localize`:@@incidentStatusClosed:Cerrado`,
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
  low: {
    icon: 'smart_toy',
    text: $localize`:@@lowRisk:Bajo`,
    cssClass: 'page__chip--success',
  },
  medium: {
    icon: 'smart_toy',
    text: $localize`:@@mediumRisk:Medio`,
    cssClass: 'page__chip--warning',
  },
  high: {
    icon: 'smart_toy',
    text: $localize`:@@highRisk:Alto`,
    cssClass: 'page__chip--error',
  },
  none: {
    icon: 'smart_toy',
    text: $localize`:@@highRisk:Calculando`,
    cssClass: 'page__chip--neutral',
  },
};
