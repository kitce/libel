import { immerable } from 'immer';

export interface ISerializedMeta {
  lastModifiedTime: number; // unix timestamp
  lastSyncedTime?: number; // unix timestamp
}

export interface IMeta extends ISerializedMeta { }

class Meta implements IMeta {
  [immerable] = true;
  lastModifiedTime: number;
  lastSyncedTime?: number;

  constructor (lastModifiedTime?: number, lastSyncedTime?: number) {
    this.lastModifiedTime = lastModifiedTime || Date.now();
    this.lastSyncedTime = lastSyncedTime;
  }

  static factory () {
    return new Meta();
  }

  static deserialize (meta: Meta | IMeta) {
    if (meta instanceof Meta) {
      return meta;
    }
    const { lastModifiedTime, lastSyncedTime } = meta;
    return new Meta(lastModifiedTime, lastSyncedTime);
  }

  static parseFromStorage (json: string): IMeta {
    const { lastModifiedTime, lastSyncedTime } = JSON.parse(json);
    return {
      lastModifiedTime: JSON.parse(lastModifiedTime),
      lastSyncedTime: lastSyncedTime && JSON.parse(lastSyncedTime)
    };
  }

  serialize (): ISerializedMeta {
    const { lastModifiedTime, lastSyncedTime } = this;
    return {
      lastModifiedTime,
      lastSyncedTime
    };
  }
}

export default Meta;
