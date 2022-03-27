export const state = ()=>{
  return {
    user:null
  }
}

export const mutations = {
  setUser(state,data){
    state.user = data
  }
}

export const actions = {
  // 这是个特殊的 action ,由 server 在初始化时调用
  nuxtServerInit({commit},{req}){

    let user = null
    if(process.server && req.headers.cookie){
      const cookieParser = require('cookieparser')
      // 将请求头中的 cookie 字符串解析为一个对象
      const parsed = cookieParser.parse(req.headers.cookie)
      // console.log({user:parsed.user})
      try{
        user = JSON.parse(parsed.user)
        commit('setUser',user)
      }catch (err){
        console.log('JSON parse error:',err)
      }
    }
  }
}
