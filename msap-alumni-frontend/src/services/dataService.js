import { request } from './api';

export async function fetchStories() {
  return request('/stories');
}

export async function fetchCommunityGroups() {
  return request('/community/groups');
}
