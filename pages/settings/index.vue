<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <form @submit.prevent="submit">
            <fieldset :disabled="isPublishing">
              <fieldset class="form-group">
                <input class="form-control" v-model="image"
                       type="text" placeholder="URL ofprofile picture">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text"
                       v-model="username"
                       placeholder="Your Name">
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control form-control-lg" rows="8"
                          v-model="bio"
                     placeholder="Short bio about you"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text"
                       v-model="email"
                       placeholder="Email">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="password"
                       v-model="password"
                       placeholder="Password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr>
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {getProfile, updateUser} from "@/api/settings";
import isEmpty from "@/utils/isEmpty";

export default {
  middleware:'auth',
  name:'settings',
  data(){
    return {
      "email": "",
       "bio": "",
       "image": "",
      username:'',
      password:'',
      isPublishing:false
    }
  },
// {
//   "user":{
//   "email": "jake@jake.jake",
//       "bio": "I like to skateboard",
//       "image": "https://i.stack.imgur.com/xHWG8.jpg"
  computed:{
    ...mapState(['user'])
  },
  async mounted() {
    const {data} = await getProfile(this.user.username)
    const {username,bio,image} = data.profile;
    this.username = username
    this.bio = bio
    this.image = image
  },
  created() {
    this.email= this.user.email
  },
  methods:{
    async submit(){
      if(isEmpty(this.bio)){
        alert('bio is empty')
        return
      }if(isEmpty(this.email)){
        alert('email is empty')
        return
      }if(isEmpty(this.image)){
        alert('image is empty')
        return
      }
      this.isPublishing = true
      await updateUser({
        user:{
          "email": this.email,
          "bio": this.bio,
          "image": this.image,
          username:this.username,
          password:this.password
        }
      })
      this.isPublishing = true
      await this.$router.push('/profile/' + this.username)
    },
    logout(){
      //此登录动作发生在客户端，由 client 负责将用户数据放入 cookie 中，下次请求时带上
      const Cookie = process.client?require('js-cookie'):undefined
      if(Cookie){
        Cookie.remove('user')
      }
      this.$store.commit('setUser',undefined)
      this.$router.push('/')
    }
  }
}
</script>
