import image01 from '../../../../assets/images/831/01.jpg';
import image02 from '../../../../assets/images/831/02.jpg';
import image03 from '../../../../assets/images/831/03.png';
import image04 from '../../../../assets/images/831/04.png';
import image05 from '../../../../assets/images/831/05.jpg';
import image06 from '../../../../assets/images/831/06.png';
import image07 from '../../../../assets/images/831/07.jpg';
import image08 from '../../../../assets/images/831/08.jpg';
import image09 from '../../../../assets/images/831/09.png';
import image10 from '../../../../assets/images/831/10.png';
import image11 from '../../../../assets/images/831/11.jpg';
import image12 from '../../../../assets/images/831/12.jpg';
import image13 from '../../../../assets/images/831/13.png';
import { isNoticePage } from '../../../helpers/app';

const now = new Date();
const month = now.getMonth() + 1;
const date = now.getDate();
export const enabled = (
  month === 8
  && date >= (31 - 7)
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
  image13
];

export const interval = 2000;

export const caption = '點擊以勾起更多記憶';

export const referenceURL = 'https://www.youtube.com/watch?v=vIau2kwxzZA&has_verified=1';
