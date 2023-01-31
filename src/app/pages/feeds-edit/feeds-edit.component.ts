import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FeedDoc } from 'app/services/database.models';
import { FeedsStore } from 'app/state/feeds.store';
import { BehaviorSubject, switchMap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-feeds-edit',
  templateUrl: './feeds-edit.component.html',
  styleUrls: ['./feeds-edit.component.less'],
})
export class FeedsEditComponent {
  readonly feed$ = new BehaviorSubject<FeedDoc | undefined>(undefined);

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    badge: new FormControl(''),
    fetchIntervalMinutes: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  constructor(
    route: ActivatedRoute,
    private feedsStore: FeedsStore
  ) {
    route.params
      .pipe(
        untilDestroyed(this),
        switchMap((params) => this.feedsStore.feedById$(params['id']))
      )
      .subscribe(this.feed$);

    this.feed$.pipe(untilDestroyed(this)).subscribe((feed) =>
      feed && this.form.setValue({
        title: feed.title,
        badge: feed.badge || '',
        fetchIntervalMinutes: '' + feed.fetch.intervalMinutes,
      })
    );
  }

  async saveFeed() {
    const feedDoc = {
      ...this.feed$.value!,
      title: this.form.controls.title.value!.trim(),
      badge: this.form.controls.badge.value!.trim(),
      fetch: {
        ...this.feed$.value?.fetch!,
        intervalMinutes: +this.form.controls.fetchIntervalMinutes.value!.trim(),
      },
    };
    await this.feedsStore.updateFeed(feedDoc);
  }
}
