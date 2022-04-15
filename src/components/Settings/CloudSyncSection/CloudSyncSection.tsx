import React from 'react';
import * as TEXTS from '../../../constants/texts';
import lihkgCssClasses from '../../../stylesheets/variables/lihkg/classes.module.scss';
import SyncWithGoogleDrive from './SyncWithGoogleDrive/SyncWithGoogleDrive';

interface IProps { }

type TProps = IProps;

const CloudSyncSection: React.FunctionComponent<TProps> = () => {
  return (
    <React.Fragment>
      <small className={lihkgCssClasses.settingSectionTitle}>
        {TEXTS.SETTINGS_TITLE_CLOUD_SYNC}
      </small>
      <ul className={lihkgCssClasses.settingOptionsList}>
        <li className={lihkgCssClasses.settingOptionsItem}>
          <SyncWithGoogleDrive />
        </li>
      </ul>
    </React.Fragment>
  );
};

CloudSyncSection.displayName = 'CloudSyncSection';

export default CloudSyncSection;
