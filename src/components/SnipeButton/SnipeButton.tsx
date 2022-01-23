import classnames from 'classnames';
import React, { useCallback } from 'react';
import { EventAction } from '../../constants/ga';
import * as TEXTS from '../../constants/texts';
import * as gtag from '../../helpers/gtag';
import { waitForSubmissionForm } from '../../helpers/lihkg';
import { findReactComponent } from '../../helpers/react';
import { renderSnipingBody } from '../../helpers/sniping';
import { createUserPersonalSelector, createUserSubscriptionsSelector } from '../../store/selectors';
import { useTypedSelector } from '../../store/store';
import { IconName } from '../../types/icon';
import IconButton from '../IconButton/IconButton';
import SubmissionForm from '../SubmissionForm/SubmissionForm';
import styles from './SnipeButton.scss';

interface IProps {
  user: string;
}

type TProps = IProps & React.ComponentPropsWithoutRef<'button'>;

const SnipeButton: React.FunctionComponent<TProps> = (props) => {
  const { className, user } = props;
  const personal = useTypedSelector(createUserPersonalSelector(user));
  const subscriptions = useTypedSelector(createUserSubscriptionsSelector(user));

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(async (event) => {
    event.preventDefault();
    const { currentTarget } = event;
    const replyButton = currentTarget.parentNode?.parentNode?.parentNode?.querySelector<HTMLElement>(`.${IconName.Reply}`);
    if (replyButton) {
      const awaiter = waitForSubmissionForm();
      replyButton.click();
      const element = await awaiter;
      const formComponent = findReactComponent<SubmissionForm>(element, 1);
      const body = renderSnipingBody(user, personal, subscriptions);
      if (formComponent && body) {
        formComponent.replaceEditorContent(body);
        // analytics
        gtag.event(EventAction.Snipe, { event_label: user });
      }
    }
  }, [personal, subscriptions]);

  return (
    <IconButton
      className={classnames(className, styles.snipeButton)}
      icon={IconName.Hot}
      onClick={handleClick}
      aria-label={TEXTS.SNIPE_BUTTON_TEXT}
      data-tip={TEXTS.SNIPE_BUTTON_TEXT}
      title={TEXTS.SNIPE_BUTTON_TEXT}
    />
  );
};

export default SnipeButton;
