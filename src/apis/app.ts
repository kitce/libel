import { publicDataURL as baseURL } from '../../config/config';
import type { IconName } from '../components/Icon/types';

interface IAnnouncement {
  /** @since 1.0.18 */
  id?: string;
  icon?: IconName;
  body: string;
  endAt?: number;
  forced?: boolean;
}

export const fetchAnnouncements = async () => {
  const url = `${baseURL}/announcements.json`;
  const response = await fetch(url);
  const json = await response.json();
  return json as IAnnouncement[];
};
