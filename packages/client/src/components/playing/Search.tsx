import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useMemo
} from "react";
import { Row, Col, Input, Tabs, List, BackTop, Icon } from "antd";
import { RouteComponentProps } from "react-router";
import { useResource } from "react-request-hook";
import api from "../../core/api/model";
import { NamedPlugin, Song } from "../../core/types";
import { AlbumArt } from "./AlbumArt";
import { useDebounce } from "react-use";
import moment from "moment";
import "moment-duration-format";
import { LikedSongContext } from "../../core/context/LikedSongsContext";

export const Search = (props: RouteComponentProps) => {
  const [providers, getProviders] = useResource(api.getProviders);
  const [query, setQuery] = useState<string>("");
  const [undebouncedQuery, setUndebounced] = useState<string>("");

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        props.history.goBack();
      }
    },
    [props.history]
  );

  useDebounce(
    () => {
      setQuery(undebouncedQuery);
    },
    500,
    [setQuery, undebouncedQuery]
  );

  useEffect(() => {
    getProviders();
    document.addEventListener("keydown", handleEscape, false);
    return () => {
      document.removeEventListener("keydown", handleEscape, false);
    };
  }, [getProviders, handleEscape]);

  return (
    <div className="search">
      <BackTop />
      <Col span={3}>
        <Icon
          className="close-search"
          type="double-left"
          onClick={props.history.goBack}
        />
      </Col>
      <Col span={19}>
        <Row>
          <Input.Search
            placeholder="Search"
            onSearch={value => setQuery(value)}
            onChange={value => setUndebounced(value.target.value)}
            enterButton="Search"
            size="large"
          />
        </Row>
        <Row>
          {providers.data && (
            <Tabs>
              {providers.data.map((provider, _) => (
                <Tabs.TabPane tab={provider.name} key={provider.id}>
                  <ProviderPane query={query} provider={provider} />
                </Tabs.TabPane>
              ))}
            </Tabs>
          )}
        </Row>
      </Col>
    </div>
  );
};

const ProviderPane = (props: { query: string; provider: NamedPlugin }) => {
  const [searchResult, search] = useResource(api.search);
  const [, enqueue] = useResource(api.enqueue);

  useEffect(() => {
    if (props.query.length > 0) {
      search(props.provider, props.query);
    }
  }, [props.query, props.provider, search]);

  const enqueueWrapper = useCallback(
    (song: Song) => {
      enqueue(song, props.provider);
      if (searchResult.data) {
        searchResult.data = searchResult.data.filter(item => item !== song);
      }
    },
    [props.provider, enqueue, searchResult.data]
  );

  return (
    <List
      dataSource={searchResult.data}
      renderItem={item => (
        <List.Item
          key={item.title}
          onClick={() => enqueueWrapper(item)}
          extra={<SongItemExtra song={item} />}
          actions={[<SongItemAction song={item} />]}
        >
          <List.Item.Meta
            title={item.title}
            description={item.description.substr(0, 50)}
            avatar={<AlbumArt song={item} />}
          />
        </List.Item>
      )}
    />
  );
};

const SongItemExtra = (props: { song: Song }) => (
  <div className="ant-list-item-meta-description">
    {moment.duration(props.song.duration, "s").format("h:mm:ss")}
  </div>
);

const SongItemAction = (props: { song: Song }) => {
  const likedSongs = useContext(LikedSongContext);
  const [isLiked, setLiked] = useState<boolean>(false);
  useEffect(() => {
    setLiked(likedSongs.contains(props.song));
    console.log(likedSongs.contains(props.song));
  }, []);
  const style = useMemo(() => {
    if (isLiked) {
      return {
        color: "green"
      };
    }
  }, [isLiked]);
  const click = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (isLiked) {
        likedSongs.removeSong(props.song);
        setLiked(false);
      } else {
        likedSongs.addSong(props.song);
        setLiked(true);
      }
      event.stopPropagation();
    },
    [likedSongs, isLiked, setLiked, props.song]
  );

  return <Icon type="star" theme="filled" onClick={click} style={style} />;
};
