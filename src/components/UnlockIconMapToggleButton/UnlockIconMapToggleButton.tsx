import type React from 'react';
import { useCallback, useEffect } from 'react';
import * as lihkgActions from '../../actions/lihkg';
import * as TEXTS from '../../constants/texts';
import * as LIHKG from '../../helpers/lihkg';
import { selectConfig } from '../../store/selectors';
import { actions as configActions } from '../../store/slices/config';
import { useTypedDispatch, useTypedSelector } from '../../store/store';
import { IIconMap } from '../../types/lihkg';
import ToggleButton from '../ToggleButton/ToggleButton';

let originalIconMap: IIconMap | undefined;
let unlockedIconMap: IIconMap | undefined;

const UnlockIconMapToggleButton = () => {
  const dispatch = useTypedDispatch();
  const { isIconMapUnlocked } = useTypedSelector(selectConfig);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { checked } = event.target;
    dispatch(configActions.setIsIconMapUnlocked(checked));
  }, []);

  useEffect(() => {
    const store = LIHKG.getStore(); // original LIHKG redux store
    const { dispatch, getState } = store!;
    if (isIconMapUnlocked) {
      const state = getState();
      if (!originalIconMap) {
        originalIconMap = state.app.iconMap;
      }
      if (!unlockedIconMap) {
        unlockedIconMap = LIHKG.unlockIconMap(originalIconMap);
      }
      // spread the object due to object being not extensible
      // otherwise it will lead to error in the LIHKG main script
      dispatch(lihkgActions.setIconMap({ ...unlockedIconMap }));
    } else {
      if (originalIconMap) {
        dispatch(lihkgActions.setIconMap(originalIconMap));
      }
    }
  }, [isIconMapUnlocked]);

  return (
    <ToggleButton small flip checked={isIconMapUnlocked} onChange={handleChange}>
      {TEXTS.BUTTON_TEXT_UNLOCK_ICON_MAP}
    </ToggleButton>
  );
};

UnlockIconMapToggleButton.displayName = 'UnlockIconMapToggleButton';

export default UnlockIconMapToggleButton;
