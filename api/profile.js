import { request } from '@/plugins/request'

export const followUser = username => request({
  method: 'POST',
  url: `/api/profiles/${username}/follow`
})

export const unfollowUser = username => request({
  method: 'DELETE',
  url: `/api/profiles/${username}/follow`
})

export const getProfile = username => request({
  method: 'GET',
  url: `/api/profiles/${username}`
})