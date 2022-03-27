<template>
  <div class="article-meta">
    <nuxt-link :to="{name:'profile',params:{username:author.username}}">
      <img :src="author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link class="author" :to="{name:'profile',params:{username:author.username}}">
        {{author.username}}
      </nuxt-link>
      <span class="date">{{ author.createdAt|date('MMM DD,YYYY') }}</span>
    </div>
    <button class="btn btn-sm btn-outline-secondary"
            :disabled="followBtnDisable"
            @click="followBtnClick"
            :class="{active:author.following}">
      <i class="ion-plus-round"></i>
      &nbsp;
      {{author.following?'Unfollow': "Follow" }} {{author.username}} <span class="counter"></span>
    </button>
    &nbsp;&nbsp;
    <button class="btn btn-sm btn-outline-primary"
            :disabled="favorBtnDisable"
            @click="onFavorClick(article)"
            :class="{active:author.favorited}">
      <i class="ion-heart"></i>
      &nbsp;
      Favorite Post <span class="counter">({{ author.favoritesCount }})</span>
    </button>
  </div>
</template>

<script>
import {addFavorite, deFavorite} from "@/api/articles";
import {follow, unFollow} from "@/api/user";

export default {
  name: "article-meta",
  props:{
    author:{
      type:Object,
      required:true
    },
    article:{
      type:Object,
      required:true
    }
  },
  data(){
    return {
      favorBtnDisable:false,
      followBtnDisable:false,
    }
  },
  methods:{
    async onFavorClick(article){
      this.favorBtnDisable = true
      if(this.author.favorited){
        await deFavorite(article.slug)
        this.author.favorited = false
        this.author.favoritesCount -=1
      }else{
        await addFavorite(article.slug)
        this.author.favorited = true
        this.author.favoritesCount +=1
      }
      this.favorBtnDisable = false
    },
    async followBtnClick(){
      this.followBtnDisable = true
      if(this.author.following){
        await unFollow(this.author.username)
        this.author.following = false
      }else{
        await follow(this.author.username)
        this.author.following = true
      }
      this.followBtnDisable = false
    }
  }
}
</script>

<style scoped>

</style>
