import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Feed } from 'app/services/database.models';
import { FeedsRepository } from 'app/state/feeds.store';
import { BehaviorSubject, map, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-feeds-edit',
  templateUrl: './feeds-edit.component.html',
  styleUrls: ['./feeds-edit.component.less'],
})
export class FeedsEditComponent implements OnInit {
  readonly feed$ = new BehaviorSubject<Feed | undefined>(undefined);

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    badge: new FormControl(''),
    fetchIntervalMinutes: new FormControl('', [
      Validators.required,
      Validators.min(1),
    ]),
    retentionStrategy: new FormControl('', [Validators.required]),
    retentionDeleteOlderThanHours: new FormControl('', [
      Validators.required,
      Validators.min(1),
    ]),
  });

  constructor(
    private route: ActivatedRoute,
    private feedsRepo: FeedsRepository
  ) {}

  ngOnInit() {
    this.form.valueChanges.subscribe((formValue) => {
      if (formValue.retentionStrategy === 'delete-older-than') {
        this.form
          .get('retentionDeleteOlderThanHours')!
          .enable({ emitEvent: false });
      } else {
        this.form
          .get('retentionDeleteOlderThanHours')!
          .disable({ emitEvent: false });
      }
    });

    this.feed$.pipe(untilDestroyed(this)).subscribe((feed) => {
      if (feed) {
        this.form.setValue({
          title: feed.title,
          badge: feed.badge || '',
          fetchIntervalMinutes: '' + feed.fetch.intervalMinutes,
          retentionStrategy: feed.retention.strategy,
          retentionDeleteOlderThanHours: '24',
        });
      }
    });

    this.route.params
      .pipe(
        untilDestroyed(this),
        map((params) => this.feedsRepo.getFeed(params['id']))
      )
      .subscribe(this.feed$);
  }

  async saveFeed() {
    const feed = {
      ...this.feed$.value!,
      title: this.form.controls.title.value!.trim(),
      badge: this.form.controls.badge.value!.trim(),
      fetch: {
        ...this.feed$.value?.fetch!,
        intervalMinutes: +this.form.controls.fetchIntervalMinutes.value!.trim(),
      },
    };
    await this.feedsRepo.updateFeed(feed);
  }
}
