import axios from 'axios';
import { SearchYouTubeVideoResult } from './types';

const client = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

export const searchYouTubeVideo = async (
  q: string
): Promise<SearchYouTubeVideoResult[]> => {
  const result = await client.get(`/room_video/yt?q=${q}`);

  return result.data;
};
