import image01 from '../../../../assets/images/721/1.webp';
import image02 from '../../../../assets/images/721/2.webp';
import image03 from '../../../../assets/images/721/3.webp';
import image04 from '../../../../assets/images/721/4.webp';
import image05 from '../../../../assets/images/721/5.png';
import image06 from '../../../../assets/images/721/6.png';
import image07 from '../../../../assets/images/721/7.png';
import image08 from '../../../../assets/images/721/8.png';
import image09 from '../../../../assets/images/721/9.png';
import image10 from '../../../../assets/images/721/10.png';
import image11 from '../../../../assets/images/721/11.png';
import image12 from '../../../../assets/images/721/12.jpeg';
import image13 from '../../../../assets/images/721/13.jpg';
import image14 from '../../../../assets/images/721/14.jpg';
import image15 from '../../../../assets/images/721/15.jpg';
import image16 from '../../../../assets/images/721/16.jpg';
import image17 from '../../../../assets/images/721/17.webp';
import image18 from '../../../../assets/images/721/18.jpeg';
import image19 from '../../../../assets/images/721/19.webp';
import image20 from '../../../../assets/images/721/20.jpg';
import image21 from '../../../../assets/images/721/21.jpg';
import image22 from '../../../../assets/images/721/22.webp';
import image23 from '../../../../assets/images/721/23.webp';
import image24 from '../../../../assets/images/721/24.png';
import image25 from '../../../../assets/images/721/25.webp';
import image26 from '../../../../assets/images/721/26.jpg';
import image27 from '../../../../assets/images/721/27.webp';
import image28 from '../../../../assets/images/721/28.webp';
import { isNoticePage } from '../../../helpers/app';

const now = new Date();
const month = now.getMonth() + 1;
const date = now.getDate();
export const enabled = (
  month === 7
  && date === 21
  && isNoticePage()
);

export const images = [
  image01,
  image02,
  image03,
  image04,
  image05,
  image06,
  image07,
  image08,
  image09,
  image10,
  image11,
  image12,
  image13,
  image14,
  image15,
  image16,
  image17,
  image18,
  image19,
  image20,
  image21,
  image22,
  image23,
  image24,
  image25,
  image26,
  image27,
  image28
];

export const interval = 2000;

export const caption = '點擊以勾起更多記憶';

export const referenceURL = 'https://www.hkcnews.com/antielab-conflicts/721/721.html';
