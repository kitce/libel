import classnames from 'classnames';
import { render } from 'mustache';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import * as TEXTS from '../../../../constants/texts';
import Subscription from '../../../../models/Subscription';
import { actions as subscriptionsActions } from '../../../../store/slices/subscriptions';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.scss';
import * as questions from '../../../../templates/questions';
import IconButton, { IconName } from '../../../IconButton/IconButton';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  subscription: Subscription;
  index: number;
}

const RemoveSubscriptionButton: React.FunctionComponent<IProps> = (props) => {
  const dispatch = useDispatch();
  const { className, subscription, index } = props;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    const question = render(questions.remove.subscription, { subscription });
    const confirmed = window.confirm(question);
    if (confirmed) {
      dispatch(subscriptionsActions.remove(index));
    }
  }, [subscription, index]);

  return (
    <IconButton
      className={classnames(className, lihkgCssClasses.settingOptionButton)}
      disabled={subscription.loading}
      icon={IconName.Close}
      aria-label={TEXTS.REMOVE_SUBSCRIPTION_BUTTON_TEXT}
      data-tip={TEXTS.REMOVE_SUBSCRIPTION_BUTTON_TEXT}
      title={TEXTS.REMOVE_SUBSCRIPTION_BUTTON_TEXT}
      onClick={handleClick}
    />
  );
};

export default RemoveSubscriptionButton;
