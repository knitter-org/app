import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InitializationService } from './initialization.service';

@Component({
  selector: 'app-initialization',
  templateUrl: './initialization.component.html',
  styleUrls: ['./initialization.component.less']
})
export class InitializationComponent implements OnInit {

  constructor(
    private router: Router,
    private initializationService: InitializationService,
  ) {}

  async ngOnInit() {
    if (await this.initializationService.isInitialized()) {
      await this.router.navigateByUrl('/');
    }
  }

  async onInitializeClick() {
    await this.initializationService.initialize();
    this.router.navigate(['/']);
  }
}
