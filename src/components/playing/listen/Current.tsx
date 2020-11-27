import { Song } from '../../../core/types';
import React, { Fragment, useMemo } from 'react';
import ScreenNavigation from '../../util/ScreenNavigation';
import { useLocation } from 'react-use';
import { useContext } from 'react';
import { FullscreenContext } from '../../../core/context/FullscreenContext';
import { Link, useHistory } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { ConfigurationContext } from '../../../core/context/Configuration';
import { BackgroundAlbumArt } from '../snippets/AlbumArt';
import SwipeDiv from '../../util/SwipeDiv';
import { SettingsButton } from '../snippets/SettingsButton';

const Current = (props: { song?: Song }) => {
  const location = useLocation();
  const { toggle, isFullscreen } = useContext(FullscreenContext);
  const history = useHistory();
  const left = `${location.pathname}/history`;
  const right = `${location.pathname}/queue`;
  const swipeHandler = useSwipeable({
    onSwipedLeft: () => history.push(right),
    onSwipedRight: () => history.push(left),
    preventDefaultTouchmoveEvent: true,
  });
  const { configuration } = useContext(ConfigurationContext);

  const jsx = useMemo(
    () => (
      <Fragment>
        <SwipeDiv {...swipeHandler}>
          <BackgroundAlbumArt song={props.song!} config={configuration} />
          <ScreenNavigation left={left} right={right} center={toggle} />
          {!isFullscreen && (
            <Link to="/settings">
              <SettingsButton></SettingsButton>
            </Link>
          )}
        </SwipeDiv>
      </Fragment>
    ),
    [
      props.song,
      left,
      right,
      swipeHandler,
      toggle,
      configuration,
      isFullscreen,
    ],
  );

  return jsx;
};

export default Current;
