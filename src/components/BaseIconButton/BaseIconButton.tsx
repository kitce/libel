import classNames from 'classnames';
import type React from 'react';
import Button, { TProps as TButtonProps } from '../Button/Button';
import Icon from '../Icon/Icon';
import type { IconName } from '../Icon/types';
import styles from './BaseIconButton.module.scss';

interface IProps {
  icon: IconName | JSX.Element;
}

export type TProps = IProps & TButtonProps;

const BaseIconButton: React.FunctionComponent<TProps> = (props) => {
  const { className, children, icon, ...otherProps } = props;
  return (
    <Button
      {...otherProps}
      className={classNames(className, styles.baseIconButton)}
    >
      {
        typeof icon === 'string' ? (
          <Icon className={styles.icon} icon={icon} />
        ) : (
          <span className={styles.icon}>{icon}</span>
        )
      }
      {
        children && (
          <span>{children}</span>
        )
      }
    </Button>
  );
};

BaseIconButton.displayName = 'BaseIconButton';

export default BaseIconButton;
