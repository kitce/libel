## v3.6.3 (2022-06-27)

### Fix

- **ga**: failed to load Google Analytics

## v3.6.2 (2022-06-12)

### Fix

- **label-form**: unexpected screenshot behaviour

### Refactor

- **typings**: revise `waitForElement` types

### Feat

- **egg**: ***

## v3.6.1 (2022-06-01)

### Fix

- **egg**: incorrect script URL

## v3.6.0 (2022-05-15)

### Refactor

- **egg**: add `referenceURL`
- **cloud**: add `Cloud` model
- **apis**: reuse `RequestMethod`
- **editor**: reuse `handleClose`
- **typings**: update component typings
- **typings**: update component typings
- **editor**: update class name
- **hooks**: update `useFadeoutScroll`
- **hooks**: rename `useLazyRender` to `useVisibility`
- **stylesheets**: update variables
- **label-item**: update floating logic
- **helpers/lihkg**: use `DataSet` instead of `Personal`
- **editor**: set dirty earlier
- **components**: move loading spinner from `SettingOptionButton` to `BaseButton`
- **models**: `DataSet` → `BaseDataSet`; `Custom` → `DataSet`
- **modal**: add `useModal`
- **hooks**: change `useSettingsModalFocusTrap` to `useFocusTrap`
- **typings**: update hooks types
- **hooks**: update typings and memoization
- **settings**: separate the buttons in `ManageDataSection` into standalone components
- **typings**: update `findReduxStore` typings
- **typings**: update `lihkg` types
- **lihkg**: enhance typings
- **typings**: add type for `unregister()`

### Feat

- **egg**: ***
- **webpack**: allow import HTML
- **apis/lihkg**: update request headers
- **settings**: add convert blocked users button
- **editor**: apply fadeout scroll effect to data set editor
- **apis/lihkg**: add `fetchBlockedUser()`
- **helpers/lihkg**: add `mapBlockedUsersToDataSet()`

### Fix

- **webpack**: cannot import SVGR
- **settings**: remove notifications of cancel clear actions
- **converter**: id collision with existing label
- **label-info**: missing margin-top for buttons

### Perf

- **components**: memoization

## v3.5.0 (2022-04-18)

### Feat

- **components**: add component `FileInput`
- **store**: add middleware `createLoadSubscriptionOnEnableListener`
- **subscription**: allow drag & drop to sort the subscriptions
- **subscription**: update notification template
- **subscription**: add middleware `createLoadSubscriptionRejectedNotifier`
- **egg**: update style
- **gapi**: add notifications for sign in / sign out
- **clear-data**: replace alerts with notifications
- **text-input**: add `onClear` to enable the clear button
- **notification**: add cloud sync notifications
- **label-form**: update form validation
- **subscription-maker**: update form validation
- **subscription**: add subscription list empty message
- **subscription**: update subscription status icon style
- **label-form**: update layout
- **label-info**: update layout
- **label-info**: update layout
- **settings**: add standalone settings modal

### Refactor

- **components**: update style
- **webpack**: update configs
- **store**: remove unnecessary remote subscription loadings
- **store**: update `loadRemoteSubscriptions()` to `loadSubscriptions()`
- **store**: update subscription `load()`
- **egg**: revise imports
- **egg**: update styles
- **modal**: handle backdrop click only when the modal is opened
- **subscription-maker**: make `inputErrors` non-null
- **slideshow**: change `Slideshow` from model to component
- **slideshow**: type casting
- **stylesheets**: add mixin `logo()`
- revise imports
- **constants**: update constants
- **manage-data**: change alerts to notifications
- **editor**: change empty message to notification
- **notification**: add `createLocalNotification()` to trigger `createNotification()`
- **subscription**: update `baseRemote` schema
- **subscription**: update `Subscription` models and schemas
- **editor**: use the given `id` first
- **sniping**: update user registration formatting logic
- **hooks**: update `useScreenshot`
- **label-form**: reuse schemas
- **editor**: remove unnecessary dependency
- **components**: reuse `IconLink`
- **stylesheets**: update mixin `glow-box`
- **components**: reuse `IconLink`
- **label-form**: memoize preview image style
- **components**: add component `displayName`
- **mutation**: update to `react-dom/client` API
- **components**: update `key`
- **components**: replace `useElementID` with `useId`
- **settings**: update layout
- **components**: pass through the props for extendibility
- **components**: remove unnecessary `{true}`

### Fix

- **webpack**: webpack-dev-server WebSocket connection failure
- **subscription**: update schema `serialized`
- **merge**: `configB.subscriptionTemplates` is `undefined`
- **stylesheets**: missing Tailwind variables `--tw-*`
- **settings**: `autoFocus` not working in nested modal with focus trap
- **hooks**: incorrect ref object
- **modal**: incorrect ref objects
- **editor**: missing min-width
- **cloud-sync**: unexpected notification
- **egg**: missing CSS modules
- **subscription**: incorrect base remote subscription `homepage` schema
- **editor**: unexpected `click` event on the remove button (#11)
- **label-info**: incorrect clear data button text color in light mode
- **components**: unexpected `displayName`
- **label-info**: label info box being blocked by YouTube preview
- **mutation**: incorrect `AddLabelButton` usage
- **subscription**: missing `href` in homepage button
- **modal**: unexpected focus trap deactivation

## v3.4.1 (2022-04-05)

### Fix

- **merge**: add `mergeConfig`
- **schemas**: missing `subscriptionTemplates` in `config` schema
- **mutation**: issue of not showing labels or showing the labels on incorrect user in reply modal
- **mutation**: cannot display labels on replies after any blocked user's reply (#8)
- **label-form**: cannot enable auto screenshot (#10)

### Refactor

- **mutation**: unmount the component before removing the container from DOM
- **helpers**: update `getAvailableLabelID` to `getNextLabelID`
- **helpers**: update `getShareURL`

## v3.4.0 (2022-04-04)

### Fix

- **cloud-sync**: issue of empty storage being uploaded to cloud after clearing local data
- **cloud-sync**: unexpected sync action due to uncanceled sync registration
- **editor**: missing dependency `onChange`
- **store**: incorrect data loading logic
- **components**: incorrect toggle button `input` selectors

### Feat

- **editor**: update data set editor layout
- **modal**: update `Modal` responsive layout
- **editor**: trigger `onChange` when removing an item
- **cloud-sync**: trigger sync from cloud main script instead of cloud helper
- **editor**: enhance `filterLabelsGroupsByKeyword`
- **cloud-sync**: update `SycnWithGoogleDrive`

### Refactor

- expose `bootstrap()`

## v3.3.0 (2022-04-03)

### Fix

- **cache**: remove `Cache#targetReply`
- **mutation**: recover user card modal mutation
- **dependencies**: incorrect `@types/redux-state-sync` version
- **mutation**: conflicts with "LIHKG Show User Info"

### Feat

- **components**: update add label button icon
- **components**: update `BaseIconButton` to support custom icon element
- **mutation**: move add label button to beside of the reply button

### Refactor

- **typings**: update typings

## v3.2.0 (2022-04-02)

### Feat

- **editor**: add label color input field
- **editor**: apply lazy rendering to `UserLabelsEditor`
- **components**: add `Placeholder`
- **editor**: rewrite `DataSetEditor`
- **components**: add `ErrorMessage`
- **components**: add `IconMessage`
- **components**: add prop `invalid` to indicate invalid state without error message
- **modal**: `Header` will spread props now
- **components**: update floating position on mouse enter
- **components**: add prop `icon` to `TextInput`
- **editor**: remove row

### Refactor

- **components**: revise stylesheet
- **editor**: revise validation logic
- **dom**: consume the `observer` instance from the callback
- **typings**: update typings
- **sniping**: update sniping template rendering logic
- **components**: revise error
- **models**: remove `Label#shareURL` and `Label#clone()`
- **components**: reuse `mapValidationError`
- **components**: update typings and variables
- **components**: reuse `ErrorMessage`
- **typings**: update typings, imports and variables
- **components**: remove unnecessary `className` and spread props
- **modal**: revised `spacious` into `compact`
- **components**: update style
- **components**: update style
- **components**: update `Modal` style
- **models**: update style
- **components**: update `groupedLabels` logic
- **typings**: changed `onSubmission` to `onSubmit`
- **sniping**: rename and move files
- **models**: update `Singleton`

### Fix

- **editor**: missing `handleKeywordChange` dependencies
- **mutation**: issue of not rendering label list and snipe button for blocked users
- **components**: unexpected hardcoded `true` condition
- **mutation**: missing snipe button
- **modal**: issue of `Footer` being shrinked
- **dependencies**: incorrect `identity-obj-proxy` version
- **label-info**: missing subscription color

## v3.1.1 (2022-03-21)

### Fix

- **sniping**: missing snipe button

## v3.1.0 (2022-03-20)

### Fix

- **label-item**: update style
- **label-item**: remove `color`
- **label-form**: remove label preview
- **store**: update storage instance before loading into the store
- **helpers**: update `merge.ts`
- **models**: update `Label#id` type

### Refactor

- update imports
- **helpers**: move rendering-related methods from `lihkg.ts` to `mutation.ts`

### Feat

- **file**: update `_export` to not compress to the JSON

## v3.0.0 (2022-03-21)

### Fix

- **label-list**: update label info list box-sizing
- **label-info**: remove shadow
- **dom**: apply `requestAnimationFrame` when handling mutations
- **label-list**: fix issue of `LabelInfo` popover being covered by other elements
- **file**: `download()` fails to download file
- **subscription**: remove default subscriptions in development mode
- **components**: inconsistent number of hooks between renderings
- **editor**: remove color column
- **store**: always load the storage into store after rehydrate
- **store**: remove unnecessary `storage.load()`
- **main**: app start performance (#2)
- **editor**: `ImageCell` rendering issue
- **components**: don't show cancel alert message
- **settings**: unbind `onClick` when it is disabled
- **store**: incorrect logic of loading data into the store
- **store**: update `config` and `meta` to the store as well
- **label-form**: incorrect form id

### Refactor

- **stylesheets**: use variables for colors
- **label-list**: update label item layout
- **constants**: update texts
- **models**: add `getShareURL()`
- **typings**: rename types
- **components**: update `BaseInput` and `ColorPicker` style
- **components**: update `LabelForm` color input field style
- **components**: prevent default
- **components**: rename variable
- **models**: update typings
- **components**: rename props and types
- **components**: typings
- **scss**: change class to selector
- **label**: change `sourceURL` to `shareURL`
- **components**: use `BaseInput` for import file button
- **models**: update typings
- **models**: update `Label` to fallback possible `null` values to `undefined`
- **components**: update `ColorPicker` prop `value`
- **constants**: update texts
- **main**: only import stylesheets in main app
- **components**: update `<ColorPicker /`> to support `border` and `rounded` props
- **schemas**: update label schema exports
- **components**: update `<LabelFormModal />`
- **components**: update `<Modal />`
- **components**: update `<Modal />`
- **components**: typings
- **settings**: update style
- **cloud-sync**: update last synced time hint text rendering logic
- **settings**: use `<SettingOptionButton />`
- **models**: update methods
- **gapi**: remove unnecessary variable
- **models**: add `Singleton` model
- **lihkg**: refactor `setIconMap()`
- **store**: update typings
- **store**: update selectors
- **store**: update typings
- **gapi**: revise typing
- **gapi**: singleton
- **ga**: update Google Analytics
- typings and exports

### Feat

- **label-list**: update label list layout
- **label-list**: update label list layout
- **label-list**: update label list layout
- **components**: update label list and label item info display
- **stylesheets**: add element mixin
- **settings**: add subscription maker
- **components**: add prop `fullWidth` to `ToggleButton`
- **editor**: remove row headers
- **merge**: update merge logic
- **models**: add property `id` to `Label`
- **counter**: accept optional argument `initial`
- **sniping**: move snipe button to beside the reply button
- **components**: update data set editor and manage data section
- **editor**: update data set editor
- **editor**: add data set editor (to be continued)
- **settings**: add stats to `<Footer />`
- **store**: add clear data (local/cloud) feature
- **gapi**: add hook `useGoogleAuthorization`
- **ga**: update event tags
- **file**: data compression
- **ga**: update event tags
- **ga**: update event tags
- **ga**: add event tags
- **cloud-sync**: data compression
- **label-form**: enable autocomplete on `text` and `reason` inputs

## v2.2.2 (2022-01-16)

### Fix

- **cloud-sync**: update sync logic

## v2.2.1 (2022-01-16)

### Fix

- **cloud-sync**: incorrect sync logic

## v2.2.0 (2022-01-16)

### Feat

- **announcement**: update new version announcement

## v2.1.0 (2022-01-16)

### Feat

- **sniping**: update sniping template
- **label-list**: move the label list to the same row on nickname
- **icon**: unlock icon map

## v2.0.2 (2022-01-11)

### Fix

- **subscription**: check `url` before adding subscription

## v2.0.1 (2022-01-10)

### Fix

- **cloud-sync**: set error to `null` after finish
