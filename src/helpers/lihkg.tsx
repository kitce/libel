import debugFactory from 'debug';
import { useFloating } from '@floating-ui/react-dom';
import { Store } from '@reduxjs/toolkit';
import produce from 'immer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { namespace } from '../../package.json';
import cache from '../cache';
import AddLabelButton from '../components/AddLabelButton/AddLabelButton';
import addLabelButtonStyles from '../components/AddLabelButton/AddLabelButton.module.scss';
import announcementStyles from '../components/Announcement/Announcement.module.scss';
import LabelList from '../components/LabelList/LabelList';
import labelListStyles from '../components/LabelList/LabelList.module.scss';
import SettingSection from '../components/SettingSection/SettingSection';
import settingSectionStyles from '../components/SettingSection/SettingSection.module.scss';
import SnipeButton from '../components/SnipeButton/SnipeButton';
import snipeButtonStyles from '../components/SnipeButton/SnipeButton.module.scss';
import UnlockIconMapToggleButton from '../components/UnlockIconMapToggleButton/UnlockIconMapToggleButton';
import unlockIconMapToggleButtonStyles from '../components/UnlockIconMapToggleButton/UnlockIconMapToggleButton.module.scss';
import * as ATTRIBUTES from '../constants/attributes';
import * as REGEXES from '../constants/regexes';
import * as TEXTS from '../constants/texts';
import { persistor } from '../store/store';
import lihkgCssClasses from '../stylesheets/variables/lihkg/classes.module.scss';
import lihkgSelectors from '../stylesheets/variables/lihkg/selectors.module.scss';
import { IconName } from '../types/icon';
import { IIconMap, IUser, TTracablePost } from '../types/lihkg';
import { insertAfter, waitForElement } from './dom';
import { findReduxStore, IReactRootElement } from './redux';

// type TRendererContainer = Parameters<Renderer>[1];
type TFloatingConfig = Parameters<typeof useFloating>[0];

enum ShareType {
  Thread = 1,
  Reply = 2
}

const debug = debugFactory('libel:helper:lihkg');

export const getUserRegistrationDate = (user: IUser) => {
  return new Date(user.create_time * 1000);
};

const isThreadItem = (node: Element) => {
  return node.matches(lihkgSelectors.threadItem);
};

const isUserCardModal = (node: Element) => {
  return isModalTitleMatched(node, TEXTS.LIHKG_USER_CARD_MODAL_TITLE);
};

const isSettingsModal = (node: Element) => {
  return isModalTitleMatched(node, TEXTS.LIHKG_SETTINGS_MODAL_TITLE);
};

const isEmoteMenu = (node: Element) => {
  return node.matches(lihkgSelectors.emoteMenu);
};

const isReplyList = (node: Element) => {
  return node.matches(lihkgSelectors.replyList);
};

const isReplyItem = (node: Element) => {
  return node.matches(lihkgSelectors.replyItem);
};

const isReplyButton = (node: Element) => {
  return node.matches(`.${IconName.Reply}`);
};

const isReplyModal = (node: Element) => {
  return node.matches(lihkgSelectors.replyModal);
};

export const isNickname = (node: Element) => {
  return node.matches(lihkgSelectors.nickname);
};

const getUserIDFromNode = (node: Element) => {
  const nicknameLinkSelector = `${lihkgSelectors.nickname} > a[href^="/profile"]`;
  const nicknameLink = node.querySelector<HTMLAnchorElement>(nicknameLinkSelector);
  const href = nicknameLink?.getAttribute('href');
  const matched = href?.match(REGEXES.PROFILE_URL);
  if (matched) {
    return matched[1];
  }
};

const isModalTitleMatched = (node: Element, title: string) => {
  if (node.matches(lihkgSelectors.modal)) {
    const modalTitle = node.querySelector(lihkgSelectors.modalTitle);
    if (modalTitle) {
      return modalTitle.textContent === title;
    }
  }
  return false;
};

const renderAddLabelButton = (user: string, store: Store, container: Element) => {
  const postID = cache.targetReply?.getAttribute(ATTRIBUTES.dataPostId)!;
  const targetReply = cache.getReply(postID);
  if (targetReply) {
    ReactDOM.render(
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AddLabelButton user={user} targetReply={targetReply}>
            {TEXTS.ADD_LABEL_BUTTON_TEXT}
          </AddLabelButton>
        </PersistGate>
      </Provider>,
      container
    );
  }
};

const renderLabelList = (user: string, store: Store, floatingConfig: TFloatingConfig, container: Element) => {
  (container as Element).classList.add(labelListStyles.container);
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <LabelList
          user={user}
          floatingConfig={floatingConfig}
        />
      </PersistGate>
    </Provider>,
    container
  );
};

const renderSnipeButton = (user: string, store: Store, container: Element) => {
  (container as Element).classList.add(lihkgCssClasses.replyToolbarButton);
  (container as Element).classList.add(snipeButtonStyles.container);
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SnipeButton user={user} />
      </PersistGate>
    </Provider>,
    container
  );
};

const renderSettingSection = (store: Store, container: Element) => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SettingSection />
      </PersistGate>
    </Provider>,
    container
  );
};

const renderUnlockIconMapToggleButton = (store: Store, container: Element) => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <UnlockIconMapToggleButton />
      </PersistGate>
    </Provider>,
    container
  );
};

export const renderAnnouncement = async (announcement: React.ReactElement) => {
  const container = document.createElement('div');
  container.classList.add(announcementStyles.container);
  const rightPanelContainer = await waitForRightPanelContainer();
  rightPanelContainer?.insertBefore(container, rightPanelContainer.firstChild);
  ReactDOM.render(announcement, container);
};

const handleThreadItemMutation = (node: Element, store: Store) => {
  const threadLink = node.querySelector(lihkgSelectors.threadLink)!;
  const href = threadLink.getAttribute('href')!;
  const threadId = href.match(REGEXES.THREAD_URL)![1];
  const thread = cache.getThread(threadId);
  if (thread) {
    const { user_id: user } = thread;
    const threadItemInner = node.querySelector(lihkgSelectors.threadItemInner)!;
    const container = document.createElement('div');
    threadItemInner.insertAdjacentElement('afterbegin', container);
    renderLabelList(user, store, undefined, container);
  }
};

const handleUserCardModalMutation = (node: Element, store: Store) => {
  const doxButtonSelector = `${lihkgSelectors.userCardButtonsContainer} > a[href^="/profile"]`;
  const doxButton = node.querySelector(doxButtonSelector);
  const href = doxButton?.getAttribute('href');
  const matched = href?.match(REGEXES.PROFILE_URL);
  if (matched) {
    const [, user] = matched;
    const modelContentInner = node.querySelector(`${lihkgSelectors.modalContent} > div`)!;
    const labelListContainer = document.createElement('div');
    modelContentInner.appendChild(labelListContainer);
    const floatingConfig: TFloatingConfig = { strategy: 'fixed', placement: 'bottom-start' };
    renderLabelList(user, store, floatingConfig, labelListContainer);
    const userCardButtonsContainer = node.querySelector(lihkgSelectors.userCardButtonsContainer)!;
    const addLabelButtonContainer = document.createElement('div');
    addLabelButtonContainer.classList.add(addLabelButtonStyles.container);
    userCardButtonsContainer.appendChild(addLabelButtonContainer);
    renderAddLabelButton(user, store, addLabelButtonContainer);
  }
};

const handleSettingsModalMutation = (node: Element, store: Store) => {
  const modelContentInner = node.querySelector(`${lihkgSelectors.modalContent} > div`)!;
  const container = document.createElement('div');
  container.classList.add(settingSectionStyles.container);
  modelContentInner.appendChild(container);
  renderSettingSection(store, container);
};

const handleEmoteMenuMutation = (node: Element, store: Store) => {
  const toolbar = node.querySelector(lihkgSelectors.emoteMenuToolbar);
  const container = document.createElement('div');
  container.classList.add(unlockIconMapToggleButtonStyles.container);
  toolbar!.appendChild(container);
  renderUnlockIconMapToggleButton(store, container);
};

const handleReplyListMutation = (node: Element, store: Store) => {
  const nodes = Array.from(node.querySelectorAll(lihkgSelectors.replyItemInner));
  for (const node of nodes) {
    handleReplyItemInnerMutation(node, store);
  }
};

const handleReplyItemMutation = (node: Element, store: Store) => {
  const _node = node.querySelector(lihkgSelectors.replyItemInner)!;
  handleReplyItemInnerMutation(_node, store);
};

const handleReplyItemInnerMutation = (node: Element, store: Store) => {
  const user = getUserIDFromNode(node);
  if (user) {
    const containerCacheKey = `__${namespace}__cache__container__`;
    (node as any)[containerCacheKey]?.remove();
    const container = document.createElement('div');
    node.insertAdjacentElement('afterbegin', container);
    const floatingConfig: TFloatingConfig = { strategy: 'absolute', placement: 'bottom-start' };
    renderLabelList(user, store, floatingConfig, container);
    (node as any)[containerCacheKey] = container;
  }
};

const handleReplyButtonMutation = (node: Element, store: Store) => {
  const replyItemHeader = node.parentElement!;
  handleReplyItemHeaderMutation(replyItemHeader, store);
};

const handleReplyItemHeaderMutation = (node: Element, store: Store) => {
  const user = getUserIDFromNode(node);
  if (user) {
    const replyButton = node.querySelector(`.${IconName.Reply}`);
    if (replyButton) {
      const containerCacheKey = `__${namespace}__cache__container__`;
      (node as any)[containerCacheKey]?.remove();
      const container = document.createElement('div');
      insertAfter(container, replyButton);
      renderSnipeButton(user, store, container);
      (node as any)[containerCacheKey] = container;
    }
  }
};

const handleReplyModalMutation = (node: Element, store: Store) => {
  const _node = node.querySelector(lihkgSelectors.replyItemInner)!;
  handleReplyItemInnerMutation(_node, store);
};

export const handleDataPostIdAttributeMutation = (node: Element, store: Store) => {
  const _node = node.querySelector(lihkgSelectors.replyItemInner)!;
  handleReplyItemInnerMutation(_node, store);
};

export const mutationHandlerFactory = (node: Element) => {
  debug('mutationHandlerFactory', node);
  /** when render the thread item */
  if (isThreadItem(node)) return handleThreadItemMutation;
  /** when render the user card modal */
  if (isUserCardModal(node)) return handleUserCardModalMutation;
  /** when render the settings modal */
  if (isSettingsModal(node)) return handleSettingsModalMutation;
  /** when render the emote menu */
  if (isEmoteMenu(node)) return handleEmoteMenuMutation;
  /** when render the reply list (probably when enter the thread or go to next page) */
  if (isReplyList(node)) return handleReplyListMutation;
  /** when render the reply item (probably inside the reply modal) */
  if (isReplyItem(node)) return handleReplyItemMutation;
  /** when expand the short reply item */
  if (isReplyButton(node)) return handleReplyButtonMutation;
  /** when render reply modal */
  if (isReplyModal(node)) return handleReplyModalMutation;
};

export const waitForSubmissionForm = () => {
  return waitForElement(lihkgSelectors.submissionForm);
};

const waitForRightPanelContainer = async () => {
  const splitView = await waitForElement(lihkgSelectors.splitView);
  return splitView.querySelector(lihkgSelectors.rightPanelContainer)!;
};

/**
 * get the original LIHKG redux store
 */
export const getStore = () => {
  const app = document.querySelector(lihkgSelectors.app);
  const store = findReduxStore(app as IReactRootElement);
  return store;
};

/**
 * unlock all icons
 * @param {IIconMap} iconMap the original LIHKG icon map
 * @returns the unlocked icon map
 */
export const unlockIconMap = (iconMap: IIconMap) => {
  return produce(iconMap, (iconMap) => {
    const keys = Object.keys(iconMap);
    for (const key of keys) {
      const iconSet = iconMap[key];
      iconSet.icons = { ...iconSet.icons, ...iconSet.special }; // unlock all special icons
      delete iconSet.showOn; // unlock all icon sets by removing the show conditions
    }
  });
};

/**
 * get the share id of the reply
 * @copyright the implementation is a reference from LIHKG source code
 * @param {TTracablePost} post the label source 
 * @returns the share id
 */
export const getShareID = (post: TTracablePost) => {
  const e = post.thread_id; // thread id
  if (post.msg_num === '1') {
    return e;
  }
  const t = ShareType.Reply; // the share type: thread or reply
  const n = parseInt(post.msg_num, 10); // the share variable: page number or message number
  const x = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQR'; // the hash seed
  const C = (e: number, t: string) => {
    let n;
    let r = '';
    while (e > 0) {
      r = t[n = (e - 1) % t.length] + r;
      e = parseInt(((e - n) / t.length).toString(), 10);
    }
    return r;
  };
  if (t > 0) {
    const r = n.toString().length - 1;
    const i = r << 1 | t - 1;
    return C(parseInt(`${e}${n}`, 10), x) + 'STUVWXYZ'[i];
  }
  // since `type > 0` will always be `true`
  // this will neven happen, but just keep this for consistency
  return C(parseInt(e, 10), 'abcdefghijkmnopqrstuvwxyz');
};
