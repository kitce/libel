import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import type { ActionType } from 'typesafe-actions';
import storage from '../../helpers/storage';
import Config, { IConfig } from '../../models/Config';
import type { IBaseSubscription } from '../../models/Subscription';

interface IUpdateSubscriptionTemplatePayload {
  index: number;
  subscriptionTemplate: IBaseSubscription;
}

const initialState = Config.factory();

const slice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setIsIconMapUnlocked: (state, action: PayloadAction<boolean>) => {
      const { payload } = action;
      state.isIconMapUnlocked = payload;
    },
    addSubscriptionTemplate: (state, action: PayloadAction<IBaseSubscription>) => {
      const { payload } = action;
      state.subscriptionTemplates.push(payload);
    },
    updateSubscriptionTemplate: {
      reducer: (state, action: PayloadAction<IUpdateSubscriptionTemplatePayload>) => {
        const { payload } = action;
        const { index, subscriptionTemplate } = payload;
        state.subscriptionTemplates[index] = subscriptionTemplate;
      },
      prepare: (index: number, subscriptionTemplate: IBaseSubscription) => {
        return {
          payload: { index, subscriptionTemplate }
        };
      }
    },
    removeSubscriptionTemplate: (state, action: PayloadAction<number>) => {
      const { payload: index } = action;
      state.subscriptionTemplates.splice(index, 1);
    },
    update: (state, action: PayloadAction<Config | IConfig>) => {
      const { payload: config } = action;
      return Config.deserialize(config);
    }
  }
});

export const { actions } = slice;

// export type TActions = ReturnType<typeof actions[keyof typeof actions]>;
export type TActions = ActionType<typeof slice.actions>;

export const persistedReducer = persistReducer({
  keyPrefix: '',
  key: 'config',
  storage: storage,
  whitelist: ['isIconMapUnlocked', 'subscriptionTemplates']
}, slice.reducer);

export default slice;
