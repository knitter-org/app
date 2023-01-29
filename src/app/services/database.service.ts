import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { Doc, SyncSettingsDoc } from './database.models';

import PouchDB from 'pouchdb';

export type SyncStatus = 'disabled' | 'disconnected' | 'connected' | 'error';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private syncHandler?: any;

  public db: PouchDB.Database;

  private _syncStatus$ = new BehaviorSubject<SyncStatus>('disabled');
  readonly syncStatus$ = this._syncStatus$.pipe(distinctUntilChanged());

  constructor() {
    this.db = new PouchDB('knitter');
    this.tryResumeServerSync();
  }

  /**
   * Try to resume server sync if it was configured before.
   * If so, a 'settings:sync' doc should exist.
   */
  private async tryResumeServerSync() {
    try {
      const syncSettingsDoc: SyncSettingsDoc = await this.db.get('settings:sync');
      this.startServerSync(syncSettingsDoc.serverUrl);
    } catch {}
  }

  async put(doc: Doc) {
    return this.db.put(doc);
  }

  startServerSync(serverUrl: string) {
    this.stopServerSync();

    this.syncHandler = this.db.sync(serverUrl, {
      live: true,
      retry: true
    }).on('change', (change: any) => {
      this._syncStatus$.next('connected');
    }).on('paused', (info: any) => {
      this._syncStatus$.next('disconnected');
    }).on('error', (err: any) => {
      this._syncStatus$.next('error');
    });
  }

  stopServerSync() {
    if (this.syncHandler) {
      this.syncHandler.cancel();
      this.syncHandler = undefined;
      this._syncStatus$.next('disabled');
    }
  }

  async dropDatabase() {
    await this.db.destroy();
  }
}
