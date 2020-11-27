import { StarFilled } from '@ant-design/icons';
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import { Song } from '../../../../core/types';
import { db } from '../../../../core/db/AppDB';
import { fromSong } from '../../../../core/db/LikedSong';
import { ConfigurationContext } from '../../../../core/context/Configuration';

const SongItemAction = (props: { song: Song }): JSX.Element => {
  const [isLiked, setLiked] = useState<boolean>(false);
  const { configuration } = useContext(ConfigurationContext);
  useEffect(() => {
    db.songs.get(props.song.id).then((value) => value && setLiked(true));
  }, [setLiked, props.song]);
  const style = useMemo(() => {
    if (isLiked) {
      return {
        color: '#00b300',
      };
    }
    return {
      color: '#e6e6e6',
    };
  }, [isLiked]);
  const click = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (isLiked) {
        db.songs.delete(props.song.id);
        setLiked(false);
      } else {
        fromSong(props.song).save(configuration);
        setLiked(true);
      }
      event.stopPropagation();
    },
    [isLiked, setLiked, props.song, configuration],
  );
  return <StarFilled onClick={click} style={style} />;
};

export default SongItemAction;
