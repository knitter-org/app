export interface Doc {
  _id: string;
  _rev?: string;
  type: 'feed' | 'entry' | 'channel' | 'settings' | 'database-info';
}

export interface DatabaseInfoDoc extends Doc {
  _id: 'database-info';
  type: 'database-info';
  schemaVersion: number;
}
export interface Feed {
  id: string;
  rev: string;
  title: string;
  badge?: string;
  url: string;
  fetch: {
    lastSuccessfulAt: Date;
    intervalMinutes: number;
  };
  retention: RetentionKeepForever | RetentionDeleteOlderThan;
}

export interface RetentionKeepForever {
  strategy: 'keep-forever';
}
export interface RetentionDeleteOlderThan {
  strategy: 'delete-older-than';
  thresholdHours: number;
}

export interface Entry {
  id: string;
  feedId: string;
  title: string;
  text: string;
  publishedAt: Date;
  readAt?: Date;
  url: string;
}

export interface ChannelOrderDoc extends Doc {
  order: string[];
}

export interface ChannelDoc extends Doc {
  type: 'channel';
  title: string;
}

export interface SyncSettingsDoc extends Doc {
  type: 'settings';
  _id: 'settings:sync';
  serverUrl: string;
}
export interface FeedProxySettingsDoc extends Doc {
  type: 'settings';
  _id: 'settings:feed-proxy';
  proxyUrl: string;
}
