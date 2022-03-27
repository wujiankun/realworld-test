import { request } from "@/plugins/request";

export const getProfile = username=>{
  return request({
    method:'GET',
    url:`/api/profiles/${username}`
  })
}
export const updateUser = data=>{
  return request({
    method:'PUT',
    url:`/api/user`,
    data
  })
}
