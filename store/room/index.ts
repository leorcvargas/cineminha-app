import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import generateRandomColor from '../../common/generators/generateColor';
import { ChatMessage, RoomStore, RoomUserState, RoomVideoState } from './types';
import * as client from '../../api';
import { SearchYouTubeVideoResult } from '../../api/types';

export const searchYouTubeVideo = createAsyncThunk(
  'posts/fetchPosts',
  async (q: string) => client.searchYouTubeVideo(q)
);

const initialState: RoomStore = {
  user: {
    id: '',
    name: '',
    color: generateRandomColor(),
  },
  currentVideo: {
    url: '',
    progress: 0,
    duration: 10,
  },
  videos: [],
  player: {
    volume: 0.5,
    muted: false,
    playing: false,
    statusBy: 'client',
    fullscreen: false,
  },
  chat: {
    messages: [],
  },
  onlineUsers: [],
  youtubeSearch: {
    result: [],
    status: null,
    error: null,
  },
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setVideoURL: (state, action: PayloadAction<string>) => {
      state.currentVideo.url = action.payload;
    },
    setVideos: (state, action: PayloadAction<RoomVideoState[]>) => {
      state.videos = action.payload;
    },
    loadVideos: (state, action: PayloadAction<RoomVideoState[]>) => {
      state.videos = action.payload;
      const [firstVideo] = action.payload;
      state.currentVideo.url = firstVideo?.url;
      state.player.playing = false;
      state.player.statusBy = 'client';
    },
    setVideoProgress: (state, action: PayloadAction<number>) => {
      state.currentVideo.progress = action.payload;
    },
    setVideoDuration: (state, action: PayloadAction<number>) => {
      state.currentVideo.duration = action.payload;
    },
    setPlayerVolume: (state, action: PayloadAction<number>) => {
      state.player.volume = action.payload;
    },
    setPlayerMuted: (state, action: PayloadAction<boolean>) => {
      state.player.muted = action.payload;
    },
    setPlayerPlay: (state) => {
      state.player.playing = true;
      state.player.statusBy = 'client';
    },
    setPlayerPause: (state) => {
      state.player.playing = false;
      state.player.statusBy = 'client';
    },
    setServerPlay: (state) => {
      state.player.playing = true;
      state.player.statusBy = 'server';
    },
    setServerPause: (state) => {
      state.player.playing = false;
      state.player.statusBy = 'server';
    },
    setRoomOnlineUsers: (state, action: PayloadAction<RoomUserState[]>) => {
      state.onlineUsers = action.payload;
    },
    appendRoomChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      const { messages: currentMessages } = state.chat;

      state.chat.messages = [...currentMessages, action.payload];
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.user.id = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.user.name = action.payload;
    },
    setUserColor: (state, action: PayloadAction<string>) => {
      state.user.color = action.payload;
    },
    setRandomUserColor: (state) => {
      state.user.color = generateRandomColor();
    },
    setFullscreen: (state, action: PayloadAction<boolean>) => {
      state.player.fullscreen = action.payload;
    },
    resetChat: (state) => {
      state.chat = { ...initialState.chat };
    },
    resetCurrentVideo: (state) => {
      state.currentVideo = { ...initialState.currentVideo };
    },
    resetPlayer: (state) => {
      state.player = { ...initialState.player };
    },
    resetOnlineUsers: (state) => {
      state.onlineUsers = [];
    },
    resetUser: (state) => {
      state.user = { ...initialState.user };
    },
  },
  extraReducers: {
    [searchYouTubeVideo.pending.type]: (state) => {
      state.youtubeSearch.status = 'loading';
    },
    [searchYouTubeVideo.rejected.type]: (state, action) => {
      state.youtubeSearch.status = 'failed';
      state.youtubeSearch.error = action.payload;
    },
    [searchYouTubeVideo.fulfilled.type]: (
      state,
      action: PayloadAction<SearchYouTubeVideoResult[]>
    ) => {
      state.youtubeSearch.status = 'succeeded';
      state.youtubeSearch.result = action.payload.map((item) => ({
        channelName: item.channel_name,
        id: item.id,
        title: item.title,
        thumbnailUrl: item.thumbnail_url,
        url: item.url,
      }));
    },
  },
});

export const {
  setPlayerMuted,
  setPlayerPlay,
  setPlayerPause,
  setServerPlay,
  setServerPause,
  setPlayerVolume,
  setVideoDuration,
  setVideoProgress,
  setVideoURL,
  setRoomOnlineUsers,
  setUserId,
  setRandomUserColor,
  appendRoomChatMessage,
  resetChat,
  resetCurrentVideo,
  resetPlayer,
  resetUser,
  resetOnlineUsers,
  setUserColor,
  setUserName,
  setVideos,
  loadVideos,
  setFullscreen,
} = roomSlice.actions;

export const { reducer } = roomSlice;
