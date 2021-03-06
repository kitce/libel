import classNames from 'classnames';
import add from 'date-fns/add';
import formatRelative from 'date-fns/formatRelative';
import { zhHK } from 'date-fns/locale';
import { render } from 'mustache';
import type React from 'react';
import { useCallback, useMemo } from 'react';
import logo from '../../../../../assets/logos/google/google-drive.png';
import cloud from '../../../../cloud';
import { SYNC_INTERVAL } from '../../../../constants/sync';
import * as TEXTS from '../../../../constants/texts';
import useGoogleAuthorization from '../../../../hooks/useGoogleAuthorization';
import { selectMeta, selectSync } from '../../../../store/selectors';
import { useTypedSelector } from '../../../../store/store';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.module.scss';
import * as messages from '../../../../templates/messages';
import Button from '../../../Button/Button';
import ErrorMessage from '../../../ErrorMessage/ErrorMessage';
import Icon from '../../../Icon/Icon';
import { IconName } from '../../../Icon/types';
import LoadingSpinner from '../../../LoadingSpinner/LoadingSpinner';
import SettingOptionButton from '../../SettingOptionButton/SettingOptionButton';
import styles from './SyncWithGoogleDrive.module.scss';

const SyncWithGoogleDrive: React.FunctionComponent = () => {
  const [auth, user, signIn, signOut, signedIn] = useGoogleAuthorization();
  const meta = useTypedSelector(selectMeta);
  const sync = useTypedSelector(selectSync);

  const infoHints = useMemo(() => {
    if (meta.lastSyncedTime) {
      const now = new Date();
      const lastSyncedTime = formatRelative(meta.lastSyncedTime, now, { locale: zhHK });
      const nextSyncTime = formatRelative(add(meta.lastSyncedTime, { seconds: SYNC_INTERVAL / 1000 }), now, { locale: zhHK });
      return [
        render(messages.sync.lastSyncedTime, { lastSyncedTime }),
        render(messages.sync.nextSyncTime, { nextSyncTime })
      ];
    }
  }, [meta.lastSyncedTime]);

  const handleSyncNowButtonClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    if (auth) {
      cloud.sync(auth);
    }
  }, [auth]);

  const handleSignIn: React.MouseEventHandler<HTMLAnchorElement> = useCallback(async (event) => {
    event.preventDefault();
    signIn();
  }, [signIn]);

  const handleSignout: React.MouseEventHandler<HTMLAnchorElement> = useCallback(async (event) => {
    event.preventDefault();
    signOut();
  }, [signOut]);

  return (
    <>
      <div className={styles.sync}>
        <img className={styles.logo} src={logo} alt='' />
        <div className={styles.info}>
          {TEXTS.CLOUD_SYNC_LABEL_GOOGLE_DRIVE}
          {
            user && signedIn && (
              <>
                <small className={styles.hint}>
                  <Icon className={styles.icon} icon={IconName.Verified} />
                  <span>
                    {TEXTS.CLOUD_SYNC_LABEL_PREFIX_CONNECTED_ACCOUNT}{' '}
                    {user.getBasicProfile().getEmail()}
                  </span>
                </small>
                {
                  sync.loading ? (
                    <small className={styles.hint}>
                      <LoadingSpinner className={styles.icon} />
                      <span>
                        {TEXTS.CLOUD_SYNC_LABEL_SYNC_IN_PROGRESS}
                      </span>
                    </small>
                  ) : (
                    <>
                      {
                        !!infoHints && (
                          <small className={classNames(styles.hint, styles.info)}>
                            <Icon className={styles.icon} icon={IconName.CloudUpload} />
                            <div>
                              {
                                infoHints.map((hint, index) => (
                                  <div key={index}>
                                    <span>
                                      {hint}
                                    </span>
                                  </div>
                                ))
                              }
                            </div>
                          </small>
                        )
                      }
                      {
                        !!sync.error ? (
                          <ErrorMessage as='small' className={styles.hint}>
                            {TEXTS.CLOUD_SYNC_ERROR_GENERIC_ERROR}
                          </ErrorMessage>
                        ) : (
                          <Button
                            className={
                              classNames(
                                lihkgCssClasses.settingOptionButton,
                                styles.button
                              )
                            }
                            onClick={handleSyncNowButtonClick}
                          >
                            {TEXTS.BUTTON_TEXT_CLOUD_SYNC_SYNC_NOW}
                          </Button>
                        )
                      }
                    </>
                  )
                }
              </>
            )
          }
        </div>
      </div>
      <SettingOptionButton onClick={signedIn ? handleSignout : handleSignIn}>
        {
          signedIn ?
            TEXTS.BUTTON_TEXT_GOOGLE_SIGNOUT :
            TEXTS.BUTTON_TEXT_GOOGLE_AUTHORIZE
        }
      </SettingOptionButton>
    </>
  );
};

SyncWithGoogleDrive.displayName = 'SyncWithGoogleDrive';

export default SyncWithGoogleDrive;
