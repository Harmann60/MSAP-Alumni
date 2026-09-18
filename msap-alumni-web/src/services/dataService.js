import { request } from './api';

export async function fetchEvents() {
  return request('/events');
}

export async function fetchStories() {
  return request('/stories');
}

export async function fetchAccounts() {
  return request('/accounts');
}

export async function fetchCommunityGroups() {
  return request('/community/groups');
}
