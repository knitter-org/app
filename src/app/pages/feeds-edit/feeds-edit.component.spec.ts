import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { FeedsRepository } from 'app/state/feeds.store';
import { of } from 'rxjs';
import { produceFeed } from 'test/feed.factory';
import { FeedsEditComponent } from './feeds-edit.component';

describe('FeedsEditComponent', () => {
  let spectator: Spectator<FeedsEditComponent>;
  const createComponent = createComponentFactory({
    component: FeedsEditComponent,
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: '123' }),
        },
      },
    ],
    mocks: [FeedsRepository, Router],
    imports: [ReactiveFormsModule],
    detectChanges: false,
  });

  describe('retention strategy', () => {
    const keepForeverInput = () =>
      spectator.query('#retentionKeepForever')! as HTMLInputElement;
    const deleteOlderThanInput = () =>
      spectator.query('#retentionDeleteOlderThan')! as HTMLInputElement;
    const deleteOlderThanHoursInput = () =>
      spectator.query('#retentionDeleteOlderThanHours')! as HTMLInputElement;
    const saveButton = () =>
      spectator.query('button[type=submit]')! as HTMLButtonElement;

    describe('initially keep-forever', () => {
      beforeEach(() => {
        const feed = produceFeed({
          retention: { strategy: 'keep-forever' },
        });

        spectator = createComponent();
        spectator.inject(FeedsRepository).getFeed$.and.returnValue(of(feed));
        spectator.detectChanges();
      });

      it('should check the keep-forever radio box initially', () => {
        expect(keepForeverInput().checked).toBeTrue();
        expect(deleteOlderThanInput().checked).toBeFalse();
        expect(deleteOlderThanHoursInput().disabled).toBeTrue();
      });

      it('should allow to select the deleteOlderThan option and save', () => {
        spectator.click(deleteOlderThanInput());

        expect(keepForeverInput().checked).toBeFalse();
        expect(deleteOlderThanInput().checked).toBeTrue();
        expect(deleteOlderThanHoursInput().disabled).toBeFalse();

        spectator.click(saveButton());

        expect(spectator.inject(FeedsRepository).updateFeed).toHaveBeenCalledOnceWith(jasmine.objectContaining({
          retention: { strategy: 'delete-older-than', thresholdHours: 24 }
        }));
      });
    });

    describe('initially delete-older-than', () => {
      beforeEach(() => {
        const feed = produceFeed({
          retention: { strategy: 'delete-older-than', thresholdHours: 10 },
        });

        spectator = createComponent();
        spectator.inject(FeedsRepository).getFeed$.and.returnValue(of(feed));
        spectator.detectChanges();
      });

      it('should check the delete-older-than radio box initially', () => {
        expect(keepForeverInput().checked).toBeFalse();
        expect(deleteOlderThanInput().checked).toBeTrue();
        expect(deleteOlderThanHoursInput().disabled).toBeFalse();
      });

      it('should allow to select the keepForever option and save', () => {
        spectator.click(keepForeverInput());

        expect(keepForeverInput().checked).toBeTrue();
        expect(deleteOlderThanInput().checked).toBeFalse();
        expect(deleteOlderThanHoursInput().disabled).toBeTrue();

        spectator.click(saveButton());

        expect(spectator.inject(FeedsRepository).updateFeed).toHaveBeenCalledOnceWith(jasmine.objectContaining({
          retention: { strategy: 'keep-forever' }
        }));
      });
    });
  });
});
