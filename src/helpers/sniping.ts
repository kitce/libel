import format from 'date-fns/format';
import { render } from 'mustache';
import cache from '../cache';
import { SNIPING_TEMPLATE_DRAFT_TITLE, SNIPING_TEMPLATE_VARIABLES_MAPPING, USER_REGISTRATION_DATE_FORMAT } from '../constants/sniping';
import { DRAFTS_KEY } from '../constants/storage';
import { getUserRegistrationDate } from '../helpers/lihkg';
import type { ILabel } from '../models/Label';
import type Personal from '../models/Personal';
import Subscription from '../models/Subscription';
import { createDataSetUserFilter } from '../store/selectors';
import defaultTemplate from '../templates/sniping/default.txt';
import { promotion, snipingItem, snipingItemImage, subscriptionItem } from '../templates/sniping/internal';
import type { IDraft } from '../types/lihkg';
import { getShareURL } from './label';
import { localStorage } from './storage';

interface ISnipingItem {
  label: ILabel;
  shareURL?: string;
  subscription: Subscription | null;
}

const getCustomTemplate = () => {
  const json = localStorage.getItem(DRAFTS_KEY);
  const drafts = (json && JSON.parse(json) || []) as IDraft[];
  const draft = drafts.find((draft) => draft.title === SNIPING_TEMPLATE_DRAFT_TITLE);
  return draft?.content;
};

const getTemplate = () => {
  const customTemplate = getCustomTemplate();
  const body = customTemplate || defaultTemplate;
  return render(
    body,
    SNIPING_TEMPLATE_VARIABLES_MAPPING,
    {},
    { tags: ['__', '__'] }
  );
};

export const renderSnipingBody = (userId: string, personal: Personal, subscriptions: Subscription[]) => {
  const user = cache.getUser(userId);
  if (user) {
    const _subscriptions = subscriptions.filter((subscription) => !!subscription.data[userId]);
    const dataSets = ([] as (Personal | Subscription)[])
      .concat(personal, _subscriptions)
      .map(createDataSetUserFilter(userId));
    const snipingItems = dataSets.reduce<ISnipingItem[]>((snipingItems, dataSet) => {
      const _snipingItems = (dataSet.data[userId] || []).map<ISnipingItem>((label) => ({
        label,
        shareURL: getShareURL(label),
        subscription: Subscription.implements(dataSet) ? dataSet : null
      }));
      return [...snipingItems, ..._snipingItems];
    }, []);
    const view = {
      user: {
        ...user,
        registrationDate: format(getUserRegistrationDate(user), USER_REGISTRATION_DATE_FORMAT)
      },
      snipingItems,
      subscriptions: _subscriptions
    };
    const snipingTemplate = getTemplate();
    const partials = { snipingItem, snipingItemImage, subscriptionItem, promotion };
    return render(snipingTemplate, view, partials);
  }
};
