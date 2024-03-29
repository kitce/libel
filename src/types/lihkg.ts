export module APIv2 {
  export interface IBaseResponseBody {
    success: number;
    server_time: number;
  }

  export interface IQuotedPostResponseBody extends IBaseResponseBody {
    response: IQuotedPostResponse;
  }

  interface IQuotedPostResponse {
    me?: IMeUser;
    post: IPost;
    thread: IThread;
  }

  export interface IReplyListResponseBody extends IBaseResponseBody {
    response: IReplyListResponse;
  }

  interface IReplyListResponse extends IThread {
    page: string;
    item_data: IPost[];
    me?: IMeUser;
  }

  export interface IQuoteListResponseBody extends IBaseResponseBody {
    response: IQuoteListResponse;
  }

  interface IQuoteListResponse {
    page: string;
    item_data: IPost[];
    thread: IThread;
    parent_post: IPost;
    me?: IMeUser;
  }

  export interface IThreadListResponseBody extends IBaseResponseBody {
    response: IThreadListResponse;
  }

  interface IThreadListResponse {
    category: ICategory;
    is_pagination: boolean;
    items: IThread[];
    me?: IMeUser;
  }

  export interface IBlockedUserResponseBody extends IBaseResponseBody {
    response: IBlockedUserResponse;
  }

  interface IBlockedUserResponse {
    blocked_user_list: IBlockedUser[];
    me: IMeUser;
  }

  export interface IErrorResponseBody extends IBaseResponseBody {
    error_code: number;
    error_message: string;
  }
}

export interface IPost {
  post_id: string;
  quote_post_id: string;
  thread_id: string;
  user_nickname: string;
  user_gender: Gender;
  like_count: string;
  dislike_count: string;
  vote_score: string;
  no_of_quote: string;
  remark: unknown[] | IPostRemark;
  status: string;
  reply_time: number;
  msg_num: string;
  msg: string;
  is_minimized_keywords: boolean;
  page: number;
  user: IUser;
  vote_status: string;
  display_vote: boolean;
  low_quality: boolean;
  quote?: IPost;
}

interface IPostRemark {
  is_newbie?: boolean;
  is_not_push_post?: boolean;
}

export interface IThread {
  thread_id: string;
  cat_id: string;
  sub_cat_id: string;
  title: string;
  user_id: string;
  user_nickname: string;
  user_gender: Gender;
  no_of_reply: string;
  no_of_uni_user_reply: string;
  like_count: number;
  dislike_count: number;
  reply_like_count: string;
  reply_dislike_count: string;
  max_reply_like_count: string;
  max_reply_dislike_count: string;
  create_time: number;
  last_reply_time: number;
  status: string;
  is_adu: boolean;
  remark: IThreadRemark;
  last_reply_user_id: string;
  max_reply: string;
  total_page: number;
  notice?: string;
  is_hot: boolean;
  category: ICategory;
  display_vote: boolean;
  vote_status: string;
  is_bookmarked: boolean;
  is_replied: boolean;
  user: IUser;
  pinned_post?: IPost;
  sub_category?: ISubCategory;
  is_highlight_sub_cat?: boolean;
}

interface ICategory {
  cat_id: string;
  name: string;
  postable: boolean;
}

interface ISubCategory {
  sub_cat_id: string;
  cat_id: string;
  name: string;
  postable: boolean;
  filterable: boolean;
  is_highlight: boolean;
  orderable: boolean;
  is_filter: boolean;
  url: string;
  query: IQuery;
}

interface IQuery {
  cat_id: string;
  sub_cat_id: string;
}

interface IThreadRemark {
  last_reply_count: number;
  author_pin_post_id?: string;
  no_of_uni_not_push_post: number;
  notice?: string;
  cover_img?: string;
}

export interface IBlockedUser extends IUser {
  blocked_time: number;
  block_remark: IBlockUserRemark;
}

interface IBlockUserRemark {
  nickname?: string;
  reason: string;
}

/**
 * LIHKG state type
 * @todo add other properties
 */
export interface IState {
  app: IApp;
}

type TVisitedThread = [threadId: number, lastMessageNumber: number, lastVisitedTime: number, page: number, messageNumber: number];

type TOfficeMode = 0 | 1 | 2;

interface IApp {
  officeMode: 0 | 1 | 2;
  modeSettings: {
    [key in TOfficeMode]: IModeSetting
  };
  isMobile: boolean;
  isHoverable: boolean;
  visitedThreads: {
    [threadId: string]: TVisitedThread;
  };
  drafts: IDraft[];
  currentUser: ICurrentUser | null;
  twoFaIsEnabled: boolean | null;
  autoLogout: IAutoLogout | null;
  keywordFilterList: any[];
  keywordFilterRegexStr: string;
  customCatIds: any[];
  iconMap: IIconMap;
  flatIconMap: IconSetData;
  editorShowIcon: number;
  editorRecentIcons: any[];
  notifyCount: number;
  pushSupported: boolean;
  pushNotification: boolean;
  featuredPushNotification: boolean;
  pushSetting: IPushSetting | null;
  preferredUploadProvider: string[];
  plusRenewable: boolean;
  alertNotice: any[];
}

interface ICurrentUser {
  token: string;
  user_id: string;
  nickname: string;
  level: string;
}

interface IModeSetting {
  darkMode: boolean;
  splitMode: boolean;
  limitContainerSize: boolean;
  showFullTimestamp: boolean;
  fontSize: number;
  autoLoadImage: boolean;
  linkHoverPreview: boolean;
  shrinkQuoteImages: boolean;
  openImageInLightbox: boolean;
  includeLinkImages: boolean;
  filterSpoilerTitle: boolean;
  showIcons: boolean;
  staticIcons: boolean;
  youtubePreview: boolean;
  showNotification: boolean;
  minimizeReply: boolean;
  previewBeforeReply: boolean;
  imageProxy: boolean;
}

export enum Gender {
  Female = 'F',
  Male = 'M',
}

export enum LevelName {
  Newbie = '新手會員',
  Normal = '普通會員',
  Admin = '站長',
}

export interface IUser {
  user_id: string;
  nickname: string;
  level: string;
  gender: Gender;
  status: string;
  // create_time: number;
  level_name: LevelName;
  is_following: boolean;
  is_blocked: boolean;
  is_disappear: boolean;
  is_newbie: boolean;
}

interface IMeUser extends IUser {
  email: string;
  plus_expiry_time: number;
  last_login_time: number;
  is_disappear: boolean;
  is_plus_user: boolean;
  meta_data: IUserMetaData;
}

interface IUserMetaData {
  custom_cat: unknown[];
  keyword_filter: string;
  login_count: number;
  last_read_notify_time: number;
  notify_count: number;
  push_setting: IPushSetting;
  twofa_setting: I2FASetting;
  auto_logout: IAutoLogout;
}

interface IAutoLogout {
  enabled: boolean;
}

interface IPushSetting {
  all: boolean;
  show_preview: boolean;
  new_reply: boolean;
  quote: boolean;
  following_new_thread: boolean;
}

interface I2FASetting {
  totp: boolean;
}

export interface IDraft {
  tid: string;
  title: string;
  channel: string;
  content: string;
  isReply: boolean;
}

export interface IIconMap {
  [name: string]: IIconSet;
}

interface IIconSet {
  icons: IconSetData;
  special?: IconSetData;
  showOn?: {
    start_time?: number;
    end_time?: number;
    keywords?: string[];
    user_id?: number[];
    cat_id?: number[];
  };
  isPinTop?: boolean;
}

interface IconSetData {
  [url: string]: string;
}


export enum NotificationType {
  Local = 'local'
  /** unnecessary to support push notification yet */
  // Push = 'push'
}

export interface ILocalNotifcationPayload {
  title?: string;
  body: string;
  actions?: ILocalNotifcationAction[];
  /** allow to close only when the close button is clicked */
  buttonCloseOnly?: boolean;
  onClick?: () => void;
}

interface ILocalNotifcationAction {
  label: string;
  /**
   * indicate whether to NOT trigger `onClick`,
   * but the notification will be dismissed anyway
   */
  isCancel?: boolean;
  onClick?: () => void;
}

export interface ILocalNotifcation {
  id: number;
  type: string;
  payload: ILocalNotifcationPayload;
  duration: number;
}

export type TNotification = ILocalNotifcation;
