import { IconButton, InputBase, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';

import { searchYouTubeVideo } from '../../store/room';
import { YouTubeSearchStore } from '../../store/room/types';
import { Store } from '../../store/types';
import { useStyles } from './styles';

interface SearchVideoProps {
  onChooseVideo: (videoUrl: string) => void;
}

const SearchVideo: FC<SearchVideoProps> = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _result = useSelector<Store, YouTubeSearchStore['result']>(
    (state) => state.room.youtubeSearch.result
  );
  const [videoSearch, setVideoSearch] = useState('');

  const handleSearchYouTube = debounce((q: string) => {
    dispatch(searchYouTubeVideo(q));
  }, 500);

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setVideoSearch(event.target.value);
    handleSearchYouTube(event.target.value);
  };

  return (
    <Paper component="div" className={classes.inputWrapper}>
      <InputBase
        id="video-url"
        name="videoURL"
        placeholder="Search for YouTube videos"
        className={classes.input}
        onChange={handleChange}
        value={videoSearch}
      />
      <IconButton type="submit">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchVideo;
