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

export interface YouTubeSearchStore {
  status: 'loading' | 'succeeded' | 'failed' | null;
  error: string | null;
  result: Array<{
    id: string;
    url: string;
    thumbnailUrl: string;
    title: string;
    channelName: string;
  }>;
}

export interface RoomStore {
  user: RoomUserState;
  currentVideo: CurrentVideoState;
  videos: RoomVideoState[];
  player: PlayerState;
  chat: ChatState;
  onlineUsers: RoomUserState[];
  youtubeSearch: YouTubeSearchStore;
}
