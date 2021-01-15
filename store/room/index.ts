import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import generateRandomColor from '../../common/generators/generateColor';

export interface CurrentVideoState {
  url: string;
  progress: number;
  duration: number;
}

export interface PlayerState {
  volume: number;
  muted: boolean;
  playing: boolean;
  statusBy: 'client' | 'server';
}

export interface ChatMessage {
  userName: string;
  userColor: string;
  message: string;
  sentAt: number;
}

export interface ChatState {
  messages: Array<ChatMessage>;
}

export interface RoomUserState {
  id: string;
  color: string;
}

export interface RoomStore {
  user: RoomUserState;
  currentVideo: CurrentVideoState;
  player: PlayerState;
  chat: ChatState;
  onlineUsers: number;
}

const initialState: RoomStore = {
  user: {
    id: '',
    color: generateRandomColor(),
  },
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
  chat: {
    messages: [],
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
    appendRoomChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      const { messages: currentMessages } = state.chat;

      state.chat.messages = [...currentMessages, action.payload];
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.user.id = action.payload;
    },
    setRandomUserColor: (state) => {
      state.user.color = generateRandomColor();
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
      state.onlineUsers = 0;
    },
    resetUser: (state) => {
      state.user = { ...initialState.user };
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
} = roomSlice.actions;

export const { reducer } = roomSlice;
