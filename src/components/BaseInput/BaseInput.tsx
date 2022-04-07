import classNames from 'classnames';
import React, { useId } from 'react';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import styles from './BaseInput.module.scss';

interface IProps {
  label?: React.ReactNode;
  error?: React.ReactNode;
}

type TComponentProps = React.ComponentPropsWithoutRef<'input'>;

export type TProps = IProps & TComponentProps;

const BaseInput: React.FunctionComponent<TProps> = (props) => {
  const { id, className, disabled, label, error, ...otherProps } = props;

  const _id = id || useId();
  const _errorId = `${_id}-error`;

  return (
    <React.Fragment>
      {
        label && (
          <span className={styles.label}>
            <label htmlFor={_id}>
              {label}
            </label>
          </span>
        )
      }
      <div className={classNames(className, styles.input)}>
        <input
          id={_id}
          disabled={disabled}
          aria-describedby={_errorId}
          {...otherProps}
        />
        {
          !!error && (
            <ErrorMessage id={_errorId} className={styles.error}>
              {error}
            </ErrorMessage>
          )
        }
      </div>
    </React.Fragment>
  );
};

BaseInput.displayName = 'Input';

export default BaseInput;
