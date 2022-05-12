import { createRoot } from 'react-dom/client';
import Slideshow, { IImage as ISlideshowImage } from '../../components/Slideshow/Slideshow';
import { waitForElement } from '../../helpers/dom';
import EasterEgg from '../../models/EasterEgg';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.module.scss';
import { caption, enabled, images, interval, videoURL } from './config/config';
import styles from './prince-edward-831.module.scss';

/**
 * Prince Edward 831
 * @see https://zh.wikipedia.org/wiki/太子站襲擊事件
 * @see https://www.thestandnews.com/politics/網傳-8-31-太子站有人喪生-醫管局-無死亡個案-19-人仍留院
 * @see https://www.thestandnews.com/politics/少女太子站跪求港鐵公開-8-31-cctv-港鐵-片段會保留-3-年
 * @see https://www.thestandnews.com/politics/教大學生會長入稟要求港鐵公開-831-cctv-法庭押後裁決
 * @see https://www.thestandnews.com/politics/回應楊岳橋及三員工指控-消防處-補充或修正紀錄常見-有人一知半解-極度遺憾
 * @see https://www.thestandnews.com/politics/831-太子站-未成年市民指遭警毆打-父親代入稟告一哥索償
 * @see https://www.thestandnews.com/society/太子站-b1-出口今早圍封-鮮花被清走
 * @see https://www.thestandnews.com/politics/油尖旺區議會討論-8-31-警指揮官-唔好再做謊言傳聲筒
 * @see https://www.hkcnews.com/article/29919/監警會-831警察太子站打人-監警會報告-29929/【監警會評831太子站】警無差別打人、傷者47分鐘後10變7、特別列車送荔枝角-報告沒解釋
 * @see https://www.hkcnews.com/article/33422/831警察太子站打人-警察暴力-33424/那一夜，由縱容恐襲變成發動恐襲
 */
const hatch = async () => {
  const notice = await waitForElement(lihkgSelectors.notice);
  const noticeImage = notice.querySelector('img')!;
  const { height, width } = noticeImage.getBoundingClientRect();
  noticeImage.classList.add(styles.hidden);

  const html = document.querySelector('html')!;
  html.classList.add(styles.egg);

  const imageRatio = height / width * 100;
  const container = document.createElement('a');
  container.setAttribute('aria-label', caption);
  container.setAttribute('href', videoURL);
  container.setAttribute('target', '_blank');
  container.classList.add(styles.container);
  container.style.paddingTop = `${imageRatio}%`;

  notice.insertBefore(container, noticeImage);

  const _images: ISlideshowImage[] = images.map((src) => ({ src }));
  const root = createRoot(container);
  root.render(
    <Slideshow
      className={styles.slideshow}
      images={_images}
      interval={interval}
      aria-hidden
    />
  );
};

const egg = new EasterEgg(hatch, enabled);

export default egg;