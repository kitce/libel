import { Middleware } from '@reduxjs/toolkit';
import { actions as metaActions } from '../slices/meta';
import { TRootState } from '../store';

interface IOptions {
  blacklist?: string[];
}

export const createLastModifiedTimeUpdater = (options: IOptions = {}): Middleware<{}, TRootState> => (store) => (next) => (action) => {
  const { dispatch } = store;
  const result = next(action);
  const { blacklist = [] } = options;
  const index = blacklist.indexOf(action.type);
  if (index === -1) {
    const now = Date.now();
    dispatch(metaActions.setLastModifiedTime(now));
  }
  return result;
};
