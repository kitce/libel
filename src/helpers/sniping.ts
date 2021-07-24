import { render } from 'mustache';
import cache from '../cache';
import { getUserRegistrationDate } from '../helpers/lihkg';
import Label, { ILabel } from '../models/Label';
import Personal from '../models/Personal';
import Subscription from '../models/Subscription';
import { snipingFooter, snipingHeader, snipingLabelItem, snipingLabelScreenshot, subscriptionItem } from '../templates/sniping';
import { IDraft } from '../types/lihkg';
import { CUSTOM_SNIPING_TEMPLATE_MAPPING, SNIPING_TEMPLATE_DRAFT_TITLE } from './../constants/sniping';
import { DRAFTS_KEY } from './../constants/storage';
import { filterDataSetForUser } from './../store/selectors';
import { snipingTemplate } from './../templates/sniping';
import { format, Format } from './date';
import { localStorage } from './storage';

interface ISnipeLabelItem extends ILabel {
  sourceURL: Label['sourceURL'];
  subscription: Subscription | null;
}

const getSnipingTemplateDraft = () => {
  const json = localStorage.getItem(DRAFTS_KEY);
  const drafts = (json && JSON.parse(json) || []) as IDraft[];
  return drafts.find((draft) => draft.title === SNIPING_TEMPLATE_DRAFT_TITLE);
};

const getSnipingTemplate = () => {
  const draft = getSnipingTemplateDraft();
  if (draft) {
    return render(
      draft.content,
      CUSTOM_SNIPING_TEMPLATE_MAPPING,
      {},
      { tags: ['__', '__'] }
    );
  }
  return snipingTemplate;
};

export const renderSnipingBody = (userID: string, personal: Personal, subscriptions: Subscription[]) => {
  const user = cache.getUser(userID);
  if (user) {
    const _subscriptions = subscriptions.filter((subscription) => !!subscription.data[userID]);
    const dataSets = ([] as (Personal | Subscription)[])
      .concat(personal, _subscriptions)
      .map((dataSet) => filterDataSetForUser(dataSet, userID));
    const labels = dataSets.reduce<ISnipeLabelItem[]>((labels, dataSet) => {
      const _labels = (dataSet.data[userID] || []).map((label) => ({
        ...label,
        sourceURL: label.sourceURL,
        subscription: Subscription.implements(dataSet) ? dataSet : null
      }));
      return labels.concat(_labels);
    }, []);
    const view = {
      user: {
        ...user,
        registrationDate: format(getUserRegistrationDate(user), Format.Display)
      },
      labels,
      subscriptions: _subscriptions
    };
    const snipingTemplate = getSnipingTemplate();
    const partials = { snipingHeader, snipingLabelItem, snipingLabelScreenshot, subscriptionItem, snipingFooter };
    return render(snipingTemplate, view, partials);
  }
};
