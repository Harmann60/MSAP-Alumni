import { request } from './api';

export async function fetchStories() {
  return request('/stories');
}
