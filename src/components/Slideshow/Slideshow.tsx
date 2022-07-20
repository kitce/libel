import classNames from 'classnames';
import type React from 'react';
import useRollingNumber from '../../hooks/useRollingNumber';
import styles from './Slideshow.module.scss';

export interface IImage {
  src: string;
  alt?: string;
}

interface IProps {
  /** the images */
  images: IImage[];
  /** the delay (ms) of changing the slide, default: 3000 */
  interval?: number;
  /** show the images in random order, default: true */
  random?: boolean;
  /** fit the image in container, default: false */
  fit?: boolean;
}

type TComponentProps = React.ComponentPropsWithoutRef<'ol'>;

type TProps = IProps & TComponentProps;

const Slideshow: React.FunctionComponent<TProps> = (props) => {
  const {
    className,
    images,
    interval = 3000,
    random = true,
    fit = false,
    ...otherProps
  } = props;

  const activeIndex = useRollingNumber(0, images.length - 1, interval, random);

  return (
    <ol {...otherProps} className={classNames(className, styles.slideshow)}>
      {
        images.map((image, index) => (
          <li
            key={index}
            className={
              classNames(
                styles.slide,
                {
                  [styles.active]: activeIndex === index,
                  [styles.fit]: fit
                }
              )
            }
          >
            {
              fit && (
                <div
                  className={styles.backdrop}
                  style={{ backgroundImage: `url(${image.src})` }}
                  aria-hidden
                />
              )
            }
            <div
              className={styles.image}
              style={{ backgroundImage: `url(${image.src})` }}
              role='img'
              aria-hidden={!image.alt}
              aria-label={image.alt}
            />
          </li>
        ))
      }
    </ol>
  );
};

Slideshow.displayName = 'Slideshow';

export default Slideshow;
