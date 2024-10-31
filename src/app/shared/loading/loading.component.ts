import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true,
  imports: [MatProgressSpinnerModule, AsyncPipe, NgIf],
})
export class LoadingComponent implements OnInit {
  loading$: Observable<boolean>;

  constructor(private readonly loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit() {
    // this.loadingService.loading$.subscribe(isLoading => {
    //   console.log('Loading state changed:', isLoading);
    // });

    this.loading$.subscribe(isLoading => {
      console.log('Loading state changed:', isLoading);
    });
  }
}
