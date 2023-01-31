import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { firstValueFrom } from 'rxjs';
import CustomValidators from '../../utils/custom-validators';
import { FeedsAddStore } from './feeds-add.store';

@Component({
  selector: 'app-feeds-add',
  templateUrl: './feeds-add.component.html',
  styleUrls: ['./feeds-add.component.less'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [provideComponentStore(FeedsAddStore)],
})
export class FeedsAddComponent {
  state$ = this.feedsAddStore.state$;

  constructor(
    private router: Router,
    private feedsAddStore: FeedsAddStore) {}

  form = new FormGroup({
    url: new FormControl('', [Validators.required, CustomValidators.url]),
  });

  async addFeed() {
    const url = this.form.value.url!.trim();
    this.feedsAddStore.fetchAndAddFeed(url);

    const feedDoc = await firstValueFrom(this.feedsAddStore.createdFeedDoc$);
    await this.router.navigate(['feeds', feedDoc?._id]);
  }
}
