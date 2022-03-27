import { request } from "@/plugins/request";

export const getArticles = params=>{
  return request({
    method:'GET',
    url:'/api/articles',
    params
  })
}

export const getArticle = slug=>{
  return request({
    method:'GET',
    url:`/api/articles/${slug}`,
  })
}
export const getFeedArticles = params=>{
  return request({
    method:'GET',
    url:'/api/articles/feed',
    params
  })
}
export const deFavorite = slug=>{
  return request({
    method:'DELETE',
    url:`/api/articles/${slug}/favorite`,
  })
}

export const addFavorite = slug=>{
  return request({
    method:'POST',
    url:`/api/articles/${slug}/favorite`,
  })
}
export const getArticleComments = slug=>{
  return request({
    method:'GET',
    url:`/api/articles/${slug}/comments`,
  })
}

export const postComment = (slug,data)=>{
  return request({
    method:'POST',
    url:`/api/articles/${slug}/comments`,
    data
  })
}
export const deleteComment = (slug,id)=>{
  return request({
    method:'DELETE',
    url:`/api/articles/${slug}/comments/${id}`
  })
}

export const publishArticle = (data)=>{
  return request({
    method:'POST',
    url:`/api/articles`,
    data
  })
}
