// import { Injectable } from '@angular/core';
// import { FeedDoc } from 'app/services/database.models';
// import { FeedReaderService } from 'app/services/feed-reader.service';
// import { FeedService } from 'app/services/feed.service';
// import { catchError, concatMap, filter, Observable, tap } from 'rxjs';

// export interface FeedsAddState {
//   status: 'IDLE' | 'FETCH_ACTIVE' | 'CREATED' | 'ERROR';
//   error?: string;
//   feedDoc?: FeedDoc;
// }

// @Injectable()
// export class FeedsAddStore {
//   constructor(
//     private feedReaderService: FeedReaderService,
//     private feedService: FeedService,
//     private feedsStore: FeedsStore
//   ) {
//     super({
//       status: 'IDLE',
//     });
//   }

//   readonly createdFeedDoc$ = this.select((state) => state.feedDoc).pipe(filter(feedDoc => !!feedDoc));

//   readonly fetchAndAddFeed = this.effect((trigger$: Observable<string>) =>
//     trigger$.pipe(
//       tap(() => this.setState({ status: 'FETCH_ACTIVE' })),
//       concatMap((url) =>
//         this.feedReaderService
//           .fetchFeed(url)
//           .then((fetchResult) => ({ url, fetchResult }))
//       ),
//       concatMap(({ url, fetchResult }) =>
//         this.feedService.addFeed(
//           fetchResult.title,
//           url,
//           fetchResult.fetchedAt,
//           fetchResult.entries
//         )
//       ),
//       tap((feedDoc) => this.feedsStore.updateFeed(feedDoc)),
//       tapResponse(
//         (feedDoc) => this.setState({ status: 'CREATED', feedDoc }),
//         (err) =>
//           this.setState({
//             status: 'ERROR',
//             error: `Failed to fetch feed (${err}).`,
//           })
//       ),
//       catchError((err, feedDoc) => {
//         console.error(err);
//         return feedDoc;
//       })
//     )
//   );
// }
