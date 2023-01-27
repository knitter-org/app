import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FeedService } from 'app/services/feed.service';
import CustomValidators from '../../utils/custom-validators';

@Component({
  selector: 'app-feeds-add',
  templateUrl: './feeds-add.component.html',
  styleUrls: ['./feeds-add.component.less'],
})
export class FeedsAddComponent {
  constructor(private router: Router, private feedService: FeedService) {}

  form = new FormGroup({
    url: new FormControl('', [Validators.required, CustomValidators.url]),
  });

  async addFeed() {
    try {
      const url = this.form.value.url!.trim();
      const feedId = await this.feedService.addFeed(url);
      this.router.navigate(['feeds', feedId]);
    } catch {
      this.form.setErrors({ invalidFeed: true });
    }
  }
}
