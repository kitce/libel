import { render } from 'mustache';
import type React from 'react';
import { Directory } from '../../../config/config';
import { name, repository } from '../../../package.json';
import * as TEXTS from '../../constants/texts';
import { versionUpdate } from '../../templates/announcements';
import type { IRelease } from '../../types/github';
import Announcement from '../Announcement/Announcement';
import { IconName } from '../Icon/types';
import styles from './NewVersionAnnouncement.module.scss';

interface IProps {
  currentVersion: string;
  newVersion: string;
  release: IRelease;
}

type TProps = IProps;

const getUserScriptURL = (release: IRelease) => {
  const { tag_name } = release;
  return `${repository.url}/raw/${tag_name}/${Directory.Dist}/${name}.user.js`;
};

const NewVersionAnnouncement: React.FunctionComponent<TProps> = (props) => {
  const { currentVersion, newVersion, release } = props;
  const oldVersionMessage = render(versionUpdate.oldVersionMessage, { currentVersion });
  const newVersionMessage = render(versionUpdate.newVersionMessage, { newVersion });
  const userScriptURL = getUserScriptURL(release);
  return (
    <Announcement className={styles.newVersionAnnouncement} icon={IconName.InfoFill} forced>
      <strong>
        <a href={userScriptURL} target="_blank">{newVersionMessage}</a>
      </strong>
      （<a href={release.html_url} target="_blank">{TEXTS.ANNOUNCEMENT_LABEL_CHANGE_LOG}</a>）
      <small>（{oldVersionMessage}）</small>
    </Announcement>
  );
};

NewVersionAnnouncement.displayName = 'NewVersionAnnouncement';

export default NewVersionAnnouncement;
