import axios from "axios";

export const request = axios.create({
  baseURL:'https://api.realworld.io'
})

export default ({store})=>{
  request.interceptors.request.use(config=>{
    const {user} = store.state

    if(user && user.token)
      config.headers.Authorization = `Token ${user.token}`
    return config
  },error=>{
    return Promise.reject(error)
  })
  request.interceptors.response.use(response=>{
    return response
  },error=>{
    console.log({error})
    return Promise.reject(error)
  })
}
