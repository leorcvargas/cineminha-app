import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RoomStore {
  currentVideo: {
    url: string;
    progress: number;
    duration: number;
  };
  player: {
    volume: number;
    muted: boolean;
    playing: boolean;
    statusBy: 'client' | 'server';
  };
  onlineUsers: number;
}

const initialState: RoomStore = {
  currentVideo: {
    url: 'https://www.youtube.com/watch?v=W36QKRS_t5k',
    progress: 0,
    duration: 10,
  },
  player: {
    volume: 0.5,
    muted: false,
    playing: true,
    statusBy: 'client',
  },
  onlineUsers: 0,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setVideoURL: (state, action: PayloadAction<string>) => {
      state.currentVideo.url = action.payload;
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
    setRoomOnlineUsers: (state, action: PayloadAction<number>) => {
      state.onlineUsers = action.payload;
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
} = roomSlice.actions;

export const { reducer } = roomSlice;
