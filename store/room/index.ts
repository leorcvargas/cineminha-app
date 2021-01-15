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
  fullscreen: boolean;
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
  name: string;
}

export interface RoomVideoState {
  id: number;
  url: string;
  roomId: string;
  inserted_at: Date;
}

export interface RoomStore {
  user: RoomUserState;
  currentVideo: CurrentVideoState;
  videos: RoomVideoState[];
  player: PlayerState;
  chat: ChatState;
  onlineUsers: RoomUserState[];
}

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
