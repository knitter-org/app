import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, map, mergeMap, Observable } from 'rxjs';
import { FeedDoc } from 'src/app/database.models';
import { FeedService } from 'src/app/feed.service';

@UntilDestroy()
@Component({
  selector: 'app-feeds-edit',
  templateUrl: './feeds-edit.component.html',
  styleUrls: ['./feeds-edit.component.less'],
})
export class FeedsEditComponent {
  readonly feedId$ = new BehaviorSubject<string | undefined>(undefined);
  readonly feed$ = new BehaviorSubject<FeedDoc | undefined>(undefined);

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    badge: new FormControl(''),
  });

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private feedService: FeedService
  ) {
    route.params
      .pipe(
        untilDestroyed(this),
        map((params) => params['id'])
      )
      .subscribe(this.feedId$);

    this.feedId$
      .pipe(
        untilDestroyed(this),
        mergeMap((feedId) => this.feedService.getFeed(feedId!))
      )
      .subscribe(this.feed$);

    this.feed$.pipe(untilDestroyed(this)).subscribe((feed) =>
      feed && this.form.setValue({
        title: feed.title,
        badge: feed.badge || '',
      })
    );
  }

  async saveFeed() {
    await this.feedService.saveFeed({
      ...this.feed$.value!,
      title: this.form.controls.title.value!,
      badge: this.form.controls.badge.value!,
    });
    this.router.navigate(['feeds', this.feedId$.value]);
  }
}
