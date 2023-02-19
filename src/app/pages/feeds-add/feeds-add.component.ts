import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FeedsRepository } from 'app/state/feeds.store';
import CustomValidators from '../../utils/custom-validators';

@Component({
  selector: 'app-feeds-add',
  templateUrl: './feeds-add.component.html',
  styleUrls: ['./feeds-add.component.less'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class FeedsAddComponent {
  fetchActive = false;

  constructor(private router: Router, private feedsRepo: FeedsRepository) {}

  form = new FormGroup({
    url: new FormControl('', [Validators.required, CustomValidators.url]),
  });

  async addFeed() {
    const url = this.form.value.url!.trim();

    try {
      this.fetchActive = true;
      const feedDoc = await this.feedsRepo.createFeedFromUrl(url);
      await this.router.navigate(['feeds', feedDoc?.id]);
    } catch {
      this.fetchActive = false;
    }
  }
}
