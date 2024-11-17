import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

interface PluginConfig {
  language: string;
  server?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  host: {
    class: 'dashboard',
  },
})
export class DashboardComponent implements OnInit {
  constructor(
    @Inject(LOCALE_ID) private readonly locale: string,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly sanitizer: DomSanitizer,
  ) {}

  public dashboardUrl: SafeUrl | null = null;

  ngOnInit() {
    const hostname = new URL(this.document.location.href).host;

    const config: { ds0: PluginConfig } = {
      ds0: {
        language: this.locale,
      },
    };

    /* istanbul ignore next */
    if (!hostname.includes('localhost')) {
      config.ds0.server = hostname;
    }

    const config_uri = encodeURIComponent(JSON.stringify(config));

    this.dashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      environment.dashboardUrl[this.locale] + `&config=${config_uri}`,
    );
  }
}
