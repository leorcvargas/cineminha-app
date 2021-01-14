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
  };
  onlineUsers: number;
}

const roomSlice = createSlice({
  name: 'room',
  initialState: {
    currentVideo: {
      url: 'https://www.youtube.com/watch?v=W36QKRS_t5k',
      progress: 0,
      duration: 10,
    },
    player: {
      volume: 0.5,
      muted: false,
      playing: true,
    },
    onlineUsers: 0,
  },
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
      if (!state.player.playing) {
        state.player.playing = true;
      }
    },
    setPlayerPause: (state) => {
      if (state.player.playing) {
        state.player.playing = false;
      }
    },
  },
});

export const {
  setPlayerMuted,
  setPlayerPlay,
  setPlayerPause,
  setPlayerVolume,
  setVideoDuration,
  setVideoProgress,
  setVideoURL,
} = roomSlice.actions;

export const { reducer } = roomSlice;
