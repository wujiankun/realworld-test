<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? 'Sign in' : 'Sign up' }}</h1>
          <p class="text-xs-center">

            <nuxt-link v-if="isLogin" to="/register">Need an account?</nuxt-link>
              <nuxt-link v-else to="/login">Have an account?</nuxt-link>
          </p>
          <ul class="error-messages">
            <template v-for="(errMsg,field) in errors">
              <li v-for="msg in errMsg" key="msg">{{field}}:{{ msg }}</li>
            </template>

          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset v-if="!isLogin" class="form-group">
              <input class="form-control form-control-lg" type="text"
                     v-model="user.username"
                     placeholder="Your Name" required>
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="email"
                     v-model="user.email"
                     placeholder="Email" required>
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="password"
                     v-model="user.password"
                     placeholder="Password" required>
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? 'Sign in' : 'Sign up' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {login, register} from "@/api/user"
export default {
  middleware:'noAuth',
  name:'Login',
  data:()=>{
    return {// w@1/111
      user:{
        username:'',
        email:'',
        password:''
      },
      errors:{}
    }
  },
  computed:{
    isLogin(){
      return this.$route.name==='login'
    }
  },
  methods:{
    async onSubmit(){
      try{
        if(this.isLogin){
          const {data} = await login({user:this.user})
          this.$store.commit('setUser',data.user)
          //此登录动作发生在客户端，由 client 负责将用户数据放入 cookie 中，下次请求时带上
          const Cookie = process.client?require('js-cookie'):undefined
          if(Cookie){
            Cookie.set('user',JSON.stringify(data.user))
          }
          await this.$router.push('/')
        }else{
          const {data} = await register({user:this.user})
          await this.$router.push('/login')
        }
      }catch (err){
        console.dir(err)
        this.errors = err.response.data.errors
      }
    }
  }
}
</script>
