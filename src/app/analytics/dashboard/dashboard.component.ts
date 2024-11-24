import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';
import { MatTabsModule } from '@angular/material/tabs';

interface PluginConfig {
  language: string;
  token: string;
  server?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatTabsModule],
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
    private readonly authService: AuthService,
  ) {}

  public dashboardIncidentsUrl: SafeUrl | null = null;
  public dashboardUsersUrl: SafeUrl | null = null;

  ngOnInit() {
    this.authService.getAnalyticsToken().subscribe(token => {
      const hostname = new URL(this.document.location.href).host;

      const config: { ds0: PluginConfig } = {
        ds0: {
          language: this.locale,
          token: token,
        },
      };

      /* istanbul ignore next */
      if (!hostname.includes('localhost')) {
        config.ds0.server = hostname;
      }

      const config_uri = encodeURIComponent(JSON.stringify(config));

      this.dashboardIncidentsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        environment.dashboardIncidentsUrl[this.locale] + `&config=${config_uri}`,
      );

      this.dashboardUsersUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        environment.dashboardUsersUrl[this.locale] + `&config=${config_uri}`,
      );
    });
  }
}
