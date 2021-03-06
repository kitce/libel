import classNames from 'classnames';
import debugFactory from 'debug';
import joi from 'joi';
import type React from 'react';
import { useCallback, useEffect, useId, useState } from 'react';
import { namespace } from '../../../package.json';
import * as TEXTS from '../../constants/texts';
import * as gtag from '../../helpers/gtag';
import { mapValidationError } from '../../helpers/validation';
import type { IDataSet } from '../../models/DataSet';
import type { IBaseRemoteSubscription, IBaseSubscription } from '../../models/Subscription';
import { color, homepage, name, version } from '../../schemas/subscription';
import { selectConfig } from '../../store/selectors';
import { actions as configActions } from '../../store/slices/config';
import { useTypedDispatch, useTypedSelector } from '../../store/store';
import { EventAction, EventCategory } from '../../types/ga';
import ColorPicker from '../ColorPicker/ColorPicker';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { IconName } from '../Icon/types';
import IconButton from '../IconButton/IconButton';
import Select from '../Select/Select';
import TextInput from '../TextInput/TextInput';
import ToggleButton from '../ToggleButton/ToggleButton';
import styles from './SubscriptionMaker.module.scss';

type TFormData = IBaseSubscription;

interface IToggleButtonState {
  isCustomColor: boolean;
}

interface IInputErrors {
  [name: string]: string | undefined;
}

export interface IProps {
  /**
   * the data set of the subscription
   */
  dataSet: IDataSet;
  /**
   * custom onSubmit event handler
   * @async
   * @throws {string} error message
   */
  onSubmit: (subscription: IBaseRemoteSubscription) => void;
}

type TComponentProps = TComponentPropsWithoutRef<'form', IProps>;

export type TProps = IProps & TComponentProps;

const debug = debugFactory('libel:component:SubscriptionMaker');

const schema = joi.object({
  name: name.required().messages({
    'any.required': TEXTS.SUBSCRIPTION_MAKER_FIELD_ERROR_NAME_REQUIRED,
    'string.empty': TEXTS.SUBSCRIPTION_MAKER_FIELD_ERROR_NAME_REQUIRED
  }),
  version: version.required().messages({
    'any.required': TEXTS.SUBSCRIPTION_MAKER_FIELD_ERROR_VERSION_REQUIRED,
    'string.empty': TEXTS.SUBSCRIPTION_MAKER_FIELD_ERROR_VERSION_REQUIRED
  }),
  homepage: homepage.messages({
    'string.uri': TEXTS.SUBSCRIPTION_MAKER_FIELD_ERROR_HOMEPAGE_INVALID,
    'string.uriCustomScheme': TEXTS.SUBSCRIPTION_MAKER_FIELD_ERROR_HOMEPAGE_INVALID
  }),
  color
});

const SubscriptionMaker: React.FunctionComponent<TProps> = (props) => {
  const { id, className, dataSet, onSubmit, ...otherProps } = props;

  const dispatch = useTypedDispatch();
  const { subscriptionTemplates } = useTypedSelector(selectConfig);

  const [subscriptionTemplateIndex, setSubscriptionTemplateIndex] = useState(-1);
  const initialFormData: TFormData = { name: '', version: '' };
  const [formData, setFormData] = useState(initialFormData);
  const [toggleButtonState, setToggleButtonState] = useState<IToggleButtonState>({
    isCustomColor: !!formData.color
  });
  const [inputErrors, setInputErrors] = useState<IInputErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const _id = id || useId();
  const _errorId = `${_id}-error`;
  const name = `${namespace}-${SubscriptionMaker.displayName!}`;

  const handleSubscriptionTemplateChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback((event) => {
    const { value } = event.target;
    const index = parseInt(value);
    const subscriptionTemplate = subscriptionTemplates[index];
    setSubscriptionTemplateIndex(index);
    setFormData(subscriptionTemplate || initialFormData);
    setInputErrors({});
  }, [subscriptionTemplates]);

  const handleSubscriptionTemplateRemoveButtonClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    const yes = window.confirm(TEXTS.SUBSCRIPTION_MAKER_MESSAGE_REMOVE_TEMPLATE_CONFIRMATION);
    if (yes) {
      dispatch(configActions.removeSubscriptionTemplate(subscriptionTemplateIndex));
      setSubscriptionTemplateIndex(-1);
      setFormData(initialFormData);
      setInputErrors({});
    }
  }, [subscriptionTemplateIndex]);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setInputErrors({ ...inputErrors, [name]: undefined });
  }, [formData, inputErrors]);

  const handleToggleButtonChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { checked, name } = event.target;
    setToggleButtonState({ ...toggleButtonState, [name]: checked });
  }, [toggleButtonState]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((event) => {
    event.preventDefault();
    const _formData: TFormData = {
      ...formData,
      homepage: formData.homepage ? formData.homepage : undefined, // unset if it is empty
      color: toggleButtonState.isCustomColor ? formData.color : undefined // unset if it is disabled
    };
    const { value, error } = schema.validate(_formData, { abortEarly: false });
    if (error) {
      const _inputErrors = mapValidationError<IInputErrors>(error, (inputErrors, key, label, value, message) => {
        // analytics
        gtag.event(EventAction.Error, { event_category: EventCategory.SubscriptionMaker, event_label: key });
        return { ...inputErrors, [key!]: message };
      }, { ...inputErrors });
      setInputErrors(_inputErrors);
    } else {
      try {
        const subscription: IBaseRemoteSubscription = { ...value as IBaseSubscription, ...dataSet };
        if (subscriptionTemplateIndex === -1) {
          dispatch(configActions.addSubscriptionTemplate(value));
          setSubscriptionTemplateIndex(subscriptionTemplates.length);
        } else {
          dispatch(configActions.updateSubscriptionTemplate(subscriptionTemplateIndex, value));
        }
        onSubmit(subscription);
      } catch (err) {
        if (typeof err === 'string') {
          setFormError(err);
        }
      }
    }
  }, [onSubmit, subscriptionTemplates, subscriptionTemplateIndex, formData, toggleButtonState, inputErrors]);

  useEffect(() => {
    setToggleButtonState({
      ...toggleButtonState,
      isCustomColor: !!formData.color
    });
  }, [formData.color]);

  return (
    <form
      {...otherProps}
      id={_id}
      name={name}
      className={classNames(className, styles.subscriptionMaker)}
      onSubmit={handleSubmit}
      aria-describedby={_errorId}
    >
      <div className={classNames(styles.inputField, styles.template)}>
        <Select
          className={styles.select}
          border
          label={TEXTS.SUBSCRIPTION_MAKER_FIELD_LABEL_TEMPLATE}
          value={subscriptionTemplateIndex}
          onChange={handleSubscriptionTemplateChange}
        >
          <option value={-1}>
            {TEXTS.SUBSCRIPTION_MAKER_TEMPLATE_OPTION_DEFAULT}
          </option>
          {
            subscriptionTemplates.map((subscriptionTemplate, index) => (
              <option key={subscriptionTemplate.name} value={index}>
                {subscriptionTemplate.name}
              </option>
            ))
          }
        </Select>
        {
          subscriptionTemplateIndex >= 0 && (
            <IconButton
              className={styles.remove}
              icon={IconName.DeleteForever}
              aria-label={TEXTS.BUTTON_TEXT_SUBSCRIPTION_MAKER_REMOVE_TEMPLATE}
              onClick={handleSubscriptionTemplateRemoveButtonClick}
            />
          )
        }
      </div>
      <div className={styles.inputField}>
        <TextInput
          className={styles.textInput}
          label={TEXTS.SUBSCRIPTION_MAKER_FIELD_LABEL_NAME}
          name="name"
          value={formData.name || ''}
          error={inputErrors.name}
          onChange={handleInputChange}
          autoFocus
          autoComplete="on"
        />
      </div>
      <div className={styles.inputField}>
        <TextInput
          className={styles.textInput}
          label={TEXTS.SUBSCRIPTION_MAKER_FIELD_LABEL_VERSION}
          name="version"
          value={formData.version || ''}
          error={inputErrors.version}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.inputField}>
        <TextInput
          className={styles.textInput}
          label={TEXTS.SUBSCRIPTION_MAKER_FIELD_LABEL_HOMEPAGE}
          placeholder={TEXTS.SUBSCRIPTION_MAKER_FIELD_PLACEHOLDER_HOMEPAGE}
          name="homepage"
          value={formData.homepage || ''}
          error={inputErrors.homepage}
          onChange={handleInputChange}
        />
      </div>
      <div className={classNames(styles.inputField, styles.color)}>
        <ToggleButton
          className={styles.toggleButton}
          checked={toggleButtonState.isCustomColor}
          name="isCustomColor"
          onChange={handleToggleButtonChange}
        >
          {TEXTS.SUBSCRIPTION_MAKER_FIELD_LABEL_COLOR}
          {
            toggleButtonState.isCustomColor && (
              <ColorPicker
                className={styles.colorPicker}
                border
                rounded
                name="color"
                value={formData.color || ''}
                onChange={handleInputChange}
              />
            )
          }
        </ToggleButton>
      </div>
      {
        !!formError && (
          <ErrorMessage id={_errorId} className={styles.error}>
            {formError}
          </ErrorMessage>
        )
      }
    </form>
  );
};

SubscriptionMaker.displayName = 'SubscriptionMaker';

export default SubscriptionMaker;
