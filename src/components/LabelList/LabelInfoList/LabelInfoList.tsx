import classNames from 'classnames';
import type React from 'react';
import { forwardRef, memo } from 'react';
import type { TLabelsGroupItem } from '../../../helpers/labelList';
import LabelInfo from '../../LabelInfo/LabelInfo';
import styles from './LabelInfoList.module.scss';

interface IProps {
  items: TLabelsGroupItem[];
}

type TComponentProps = React.ComponentPropsWithoutRef<'ul'>;

type TProps = IProps & TComponentProps;

const LabelInfoList = memo(forwardRef<HTMLUListElement, TProps>((props, ref) => {
  const { className, items, ...otherProps } = props;
  return (
    <ul ref={ref} className={classNames(className, styles.labelInfoList)} {...otherProps}>
      {
        items.map((item, key) => {
          const [user, index, label, dataSet] = item;
          return (
            <li key={key}>
              <LabelInfo
                user={user}
                index={index}
                label={label}
                dataSet={dataSet}
              />
            </li>
          );
        })
      }
    </ul>
  );
}));

LabelInfoList.displayName = 'LabelInfoList';

export default LabelInfoList;
