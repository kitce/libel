import type React from 'react';
import * as TEXTS from '../../constants/texts';
import type { ILabel } from '../../models/Label';
import { IconName } from '../Icon/types';
import IconLink from '../IconLink/IconLink';

interface IProps {
  label: ILabel;
}

type TComponentProps = React.ComponentPropsWithoutRef<'a'>;

type TProps = IProps & TComponentProps;

const LabelImageButton: React.FunctionComponent<TProps> = (props) => {
  const { label, ...otherProps } = props;
  const { image } = label;
  return image ? (
    <IconLink
      {...otherProps}
      icon={IconName.Image}
      href={image}
      target="_blank"
      aria-label={TEXTS.BUTTON_TEXT_LABEL_IMAGE}
      data-tip={TEXTS.BUTTON_TEXT_LABEL_IMAGE}
      title={TEXTS.BUTTON_TEXT_LABEL_IMAGE}
    />
  ) : null;
};

LabelImageButton.displayName = 'LabelImageButton';

export default LabelImageButton;
