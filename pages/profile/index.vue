<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="image" class="user-img"/>
            <h4>{{ username }}</h4>
            <p> {{ bio }}</p>
            <button class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round"></i>
              &nbsp;
              Follow {{ username }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link class="nav-link"
                           exact
                           :class="{active:tab==='my'}"
                           :to="{
                              name:'profile',
                              param:{
                                username:username
                              },
                              query:{tab:'my'}
                            }"
                >My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link"
                           exact
                           :class="{active:tab==='favorited'}"
                           :to="{
                              name:'profile',
                              param:{
                                username:username
                              },
                              query:{tab:'favorited'}
                            }"
                >Favorited Articles</nuxt-link>
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
      </div>
    </div>
  </div>

</template>

<script>
import {getProfile} from "@/api/settings";
import {getArticles} from "@/api/articles";

export default {
  name:'Profile',
  watchQuery:['tab'],
  async asyncData({params,query}) {
    const tab = query.tab||'my';
    const {data} = await getProfile(params.username)
    const {username,bio,image} = data.profile;
    // My Articles or Favorited Articles
    const requestParams = tab==='my'?{author:username}:{favorited:username}
    const {data:articlesData} = await getArticles(requestParams)

    return {
      articles:articlesData.articles,
      username,bio,image,
      tab
    }
  }
}
</script>
