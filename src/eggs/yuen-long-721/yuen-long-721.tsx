import { createRoot } from 'react-dom/client';
import Slideshow, { IImage as ISlideshowImage } from '../../components/Slideshow/Slideshow';
import { waitForElement } from '../../helpers/dom';
import EasterEgg from '../../models/EasterEgg';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.module.scss';
import { caption, enabled, images, interval, referenceURL } from './config/config';
import styles from './yuen-long-721.module.scss';

/**
 * Yuen Long 721
 * @see https://theinitium.com/article/20190723-hongkong-yuenlong-incident-timeline/
 * @see https://www.hkcnews.com/antielab-conflicts/721/721.html
 * @see https://www.bbc.com/zhongwen/trad/chinese-news-57526233
 * @see https://www.bbc.com/zhongwen/trad/chinese-news-49070742
 * @see https://www.rfa.org/mandarin/yataibaodao/gangtai/al1-07222019064649.html
 * @see https://zh.wikipedia.org/zh-hk/元朗襲擊事件
 */
const hatch = async () => {
  const notice = await waitForElement(lihkgSelectors.notice);
  const noticeImage = notice.querySelector('img')!;
  const { height, width } = noticeImage.getBoundingClientRect();

  const html = document.querySelector('html')!;
  html.classList.add(styles.egg);

  const imageRatio = height / width * 100;
  const container = document.createElement('a');
  container.setAttribute('aria-label', caption);
  container.setAttribute('href', referenceURL);
  container.setAttribute('target', '_blank');
  container.classList.add(styles.container);
  container.style.paddingTop = `${imageRatio}%`;

  notice.insertBefore(container, noticeImage);
  noticeImage.remove();

  const _images: ISlideshowImage[] = images.map((src) => ({ src }));
  const root = createRoot(container);
  root.render(
    <Slideshow
      className={styles.slideshow}
      images={_images}
      interval={interval}
      fit
    />
  );
};

const egg = new EasterEgg(hatch, enabled);

export default egg;
