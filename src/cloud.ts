import { EventAction, EventCategory } from './constants/ga';
import { interval } from './constants/sync';
import * as TEXTS from './constants/texts';
import * as cloud from './helpers/cloud';
import { ready } from './helpers/gapi';
import * as gtag from './helpers/gtag';
import * as LIHKG from './helpers/lihkg';
import { selectSync } from './store/selectors';
import store from './store/store';
import { NotificationType } from './types/lihkg';

let unregister: (() => void) | null = null;

export const sync = async (auth: gapi.auth2.GoogleAuth) => {
  const signedIn = auth.isSignedIn.get();
  if (signedIn) {
    const state = store.getState();
    const sync = selectSync(state);
    if (!sync.loading) {
      if (unregister) {
        unregister();
      }
      const notificationSyncInProgress = LIHKG.createNotification(NotificationType.Local, TEXTS.CLOUD_SYNC_NOTIFICATION_SYNC_IN_PROGESS, 0);
      LIHKG.showNotification(notificationSyncInProgress);
      try {
        await cloud.sync();
      } catch (err) {
        const notificationSyncFailed = LIHKG.createNotification(NotificationType.Local, TEXTS.CLOUD_SYNC_NOTIFICATION_SYNC_FAILED);
        LIHKG.showNotification(notificationSyncFailed);
      } finally {
        LIHKG.removeNotification(notificationSyncInProgress.id);
        const notificationSyncSuccess = LIHKG.createNotification(NotificationType.Local, TEXTS.CLOUD_SYNC_NOTIFICATION_SYNC_SUCCESS);
        LIHKG.showNotification(notificationSyncSuccess);
      }
      unregister = register(auth); // register next sync
      // analytics
      gtag.event(EventAction.CloudSync, { event_category: EventCategory.Google });
    }
  }
};

const register = (auth: gapi.auth2.GoogleAuth) => {
  const id = setTimeout(() => sync(auth), interval);
  return () => {
    clearTimeout(id);
    unregister = null;
  };
};

export const bootstrap = async () => {
  const gapi = await ready();
  const auth = gapi.auth2.getAuthInstance();
  // bind state change handlers
  auth.isSignedIn.listen((signedIn) => {
    if (!signedIn) {
      if (unregister) {
        unregister();
      }
    } else {
      sync(auth);
    }
  });
  // initial sync
  sync(auth);
};
