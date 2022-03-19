import classNames from 'classnames';
import debugFactory from 'debug';
import joi from 'joi';
import React, { useCallback, useEffect, useState } from 'react';
import { namespace } from '../../../package.json';
import { EventAction, EventCategory } from '../../constants/ga';
import { HEX_COLOR } from '../../constants/regexes';
import * as TEXTS from '../../constants/texts';
import * as gtag from '../../helpers/gtag';
import useElementID from '../../hooks/useElementID';
import { IDataSet } from '../../models/DataSet';
import { IRemoteSubscription } from '../../models/Subscription';
import { selectConfig } from '../../store/selectors';
import { actions as configActions } from '../../store/slices/config';
import { useTypedDispatch, useTypedSelector } from '../../store/store';
import { IconName } from '../../types/icon';
import ColorPicker from '../ColorPicker/ColorPicker';
import Icon from '../Icon/Icon';
import IconButton from '../IconButton/IconButton';
import Select from '../Select/Select';
import TextInput from '../TextInput/TextInput';
import ToggleButton from '../ToggleButton/ToggleButton';
import styles from './SubscriptionMaker.module.scss';

type TFormData = Omit<IRemoteSubscription, 'data'>;

interface IToggleButtonState {
  isCustomColor: boolean;
}

interface IInputErrors {
  [name: string]: string | undefined;
}

interface IProps {
  /**
   * the data set of the subscription
   */
  dataSet: IDataSet;
  /**
   * custom onSubmit event handler
   * @async
   * @throws {string} error message
   */
  onSubmit: (event: React.FormEvent<HTMLFormElement>, subscription: IRemoteSubscription) => Promise<void>;
}

export type TProps = IProps & Omit<React.ComponentPropsWithoutRef<'form'>, 'onSubmit'>;

const debug = debugFactory('libel:component:SubscriptionMaker');

const schema = joi.object({
  name: joi.string().trim().required().messages({
    'any.required': TEXTS.SUBSCRIPTION_MAKER_FIELD_ERROR_NAME_REQUIRED,
    'string.empty': TEXTS.SUBSCRIPTION_MAKER_FIELD_ERROR_NAME_REQUIRED
  }),
  version: joi.string().trim().required().messages({
    'any.required': TEXTS.SUBSCRIPTION_MAKER_FIELD_ERROR_VERSION_REQUIRED,
    'string.empty': TEXTS.SUBSCRIPTION_MAKER_FIELD_ERROR_VERSION_REQUIRED
  }),
  homepage: joi.string().trim().allow(''),
  color: joi.string().trim().pattern(HEX_COLOR).allow('')
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
  const [error, setError] = useState('');

  const _id = id || useElementID(SubscriptionMaker.displayName!);
  const name = `${namespace}-${SubscriptionMaker.displayName!}`;
  const errorID = `${_id}-error`;

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

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(async (event) => {
    event.preventDefault();
    const _formData: TFormData = {
      ...formData,
      homepage: formData.homepage ? formData.homepage : undefined, // unset if it is empty
      color: toggleButtonState.isCustomColor ? formData.color : undefined // unset if it is disabled
    };
    const { value, error } = schema.validate(_formData);
    if (error) {
      const _inputErrors = { ...inputErrors };
      const { details } = error;
      for (const { context, message } of details) {
        const { key } = context!;
        Object.assign(_inputErrors, { [key!]: message });
        // analytics
        gtag.event(EventAction.Error, { event_category: EventCategory.SubscriptionMaker, event_label: key });
      }
      setInputErrors(_inputErrors);
    } else {
      try {
        const subscription: IRemoteSubscription = { ...value, ...dataSet };
        if (subscriptionTemplateIndex === -1) {
          dispatch(configActions.addSubscriptionTemplate(value));
          setSubscriptionTemplateIndex(subscriptionTemplates.length);
        } else {
          dispatch(configActions.updateSubscriptionTemplate(subscriptionTemplateIndex, value));
        }
        await onSubmit(event, subscription);
      } catch (err) {
        if (typeof err === 'string') {
          setError(err);
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
      aria-describedby={errorID}
    >
      <div className={styles.inputField}>
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
              <option key={index} value={index}>
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
              aria-label={TEXTS.SUBSCRIPTION_MAKER_BUTTON_TEXT_REMOVE}
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
          fullWidth
          checked={toggleButtonState.isCustomColor}
          name="isCustomColor"
          onChange={handleToggleButtonChange}
        >
          {TEXTS.SUBSCRIPTION_MAKER_FIELD_LABEL_COLOR}
          {
            toggleButtonState.isCustomColor && (
              <div className={styles.colorPicker}>
                <ColorPicker
                  border
                  rounded
                  className={styles.input}
                  name="color"
                  value={formData.color || ''}
                  error={inputErrors.color}
                  onChange={handleInputChange}
                />
              </div>
            )
          }
        </ToggleButton>
      </div>
      {
        !!error && (
          <div id={errorID} className={styles.error}>
            <Icon className={styles.icon} icon={IconName.CommentAlert} />
            {error}
          </div>
        )
      }
    </form>
  );
};

SubscriptionMaker.displayName = 'SubscriptionMaker';

export default SubscriptionMaker;