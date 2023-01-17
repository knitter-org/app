import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { Doc } from './database.models';

(window as any).global = window;
// import * as PouchDB from 'pouchdb';
const PouchDB = require('pouchdb').default.defaults();

export type SyncStatus = 'disabled' | 'disconnected' | 'connected' | 'error';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private syncHandler?: any;

  public db: any;

  private _syncStatus$ = new BehaviorSubject<SyncStatus>('disabled');
  readonly syncStatus$ = this._syncStatus$.pipe(distinctUntilChanged());

  constructor() {
    this.db = new PouchDB('knitter');
    // this.tryResumeServerSync();
  }

  private async tryResumeServerSync() {
    // Try to resume server sync if configured via settings doc
    try {
      const syncSettingsDoc = await this.db.get('settings:sync');
      this.startServerSync(syncSettingsDoc.serverUrl);
    } catch {}
  }

  async put(doc: Doc) {
    return this.db.put(doc);
  }

  startServerSync(serverUrl: string) {
    if (this.syncHandler) {
      this.syncHandler.cancel();
      this._syncStatus$.next('disabled');
    }

    this.syncHandler = this.db.sync(serverUrl, {
      live: true,
      retry: true
    }).on('change', (change: any) => {
      console.log('sync change', change);
      this._syncStatus$.next('connected');
    }).on('paused', (info: any) => {
      console.log('sync paused', info);
      this._syncStatus$.next('disconnected');
    }).on('active', (info: any) => {
      console.log('sync active', info);
      this._syncStatus$.next('connected');
    }).on('error', (err: any) => {
      console.log('sync error', err);
      this._syncStatus$.next('error');
    });
  }
}
