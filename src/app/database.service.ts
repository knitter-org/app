import { Injectable } from '@angular/core';
import { Doc } from './database.models';

(window as any).global = window;
// import * as PouchDB from 'pouchdb';
const PouchDB = require('pouchdb').default.defaults();

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  db: any;

  constructor() {
    this.db = new PouchDB('knitter');
  }

  async put(doc: Doc) {
    return this.db.put(doc);
  }
}
