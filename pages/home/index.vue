<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link class="nav-link"
                           exact
                           :class="{active:tab==='your_feed'}"
                           :to="{name:'home',query:{tab:'your_feed'}}">Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link"
                           exact
                           :class="{active:tab==='global_feed'}"
                           :to="{name:'home',query:{tab:'global_feed'}}">Global Feed</nuxt-link>
              </li>
              <li class="nav-item" v-if="tab==='tag'">
                <nuxt-link class="nav-link active"
                           :class="{active:tab==='tag'}"
                           :to="{name:'home',query:{tab:'tag'}}">#{{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>
          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link :to="{ name:'profile',params:{username:article.slug}}">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link class="author" :to="{ name:'profile',params:{username:article.slug}}">
                  {{article.author.username}}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD,YYYY')}}</span>
              </div>
              <button
                  :disabled="article.favorDisable"
                  @click="onFavorClick(article)"
                  :class="{active:article.favorited}"
                  class="btn btn-outline-primary btn-sm pull-xs-right">
                <i class="ion-heart"></i>{{article.favoritesCount}}
              </button>
            </div>
            <nuxt-link :to="{name:'article',params:{slug:article.slug}}" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{article.description}}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
        </div>
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <nuxt-link :key="tag"  v-for="tag in tags" :to="{name:'home',query:{tag:tag,tab:'tag'}}"
                  class="tag-pill tag-default"
              >{{ tag }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <nav>
        <ul class="pagination">
          <li class="page-item"
              :class="{ active:item===page}"
              v-for="item in pageCount"
              :key="item"
          >
            <nuxt-link class="page-link"
                :to="{name:'home',query:{
                  page:item,
                  tag:$route.query.tag,
                  tab:$route.query.tab
                }}"
            >{{ item }}</nuxt-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>

</template>

<script>
import {addFavorite, deFavorite, getArticles, getFeedArticles} from "@/api/articles";
import {getTags} from "@/api/tag";
import {mapState} from 'vuex'

export default {
  name:'HomePage',
  watchQuery:['page','tag','tab'],
  async asyncData({query,store}) {
    console.log('asyncData run ')
    const limit = 4
    let {page,tab,tag} = query
    page = parseInt(page||1)
    tab = tab||'global_feed'
    const loadArticles = store.state.user && tab==='your_feed' ?
        getFeedArticles:getArticles
    const [{data},{data:tagData}] = await Promise.all([
      loadArticles({
        limit,
        offset:(page-1)*limit,
        tag
      }),
      getTags()
    ])
    if(data&&data.articles){
      data.articles.forEach(article=>article.favorDisable = false)
    }
    return {
      articles:data.articles,
      articlesCount:data.articlesCount,
      limit,
      page,
      tags:tagData.tags,
      tab,
      tag
    }
  },
  computed:{
    ...mapState(['user']),
    pageCount(){
      return Math.ceil(this.articlesCount/this.limit)
    }
  },
  methods:{
    async onFavorClick(article){
      article.favorDisable = true
      if(article.favorited){
        await deFavorite(article.slug)
        article.favorited = false
        article.favoritesCount -=1
      }else{
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount +=1
      }
      article.favorDisable = false
    }
  }
}
</script>
