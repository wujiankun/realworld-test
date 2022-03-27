<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ title }}</h1>
        <ArticleMeta :author="author" :article="article"/>
      </div>
    </div>
    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12" v-html="body"></div>
      </div>
      <hr />
      <div class="article-actions">
        <ArticleMeta :author="author" :article="article"/>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <ArticleComments :article='{slug:slug,image:author.image}' />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getArticle} from "@/api/articles";
import MarkdownIt from 'markdown-it'
import ArticleMeta from './components/article-meta'
import ArticleComments from './components/article-comments'

export default {
  name:'article-detail',
  components: {ArticleMeta,ArticleComments},
  async asyncData({params}) {
    const {data} = await getArticle(params.slug)
    data.article.body = new MarkdownIt().render(data.article.body)
    return {
      article:data.article,
      ...data.article,
      author: {
        ...data.article.author,
        createdAt: data.article.createdAt,
        favorited: data.article.favorited,
        favoritesCount: data.article.favoritesCount
      }
    }
  },
  head(){
    return {
      title:this.title+' - RealWorld',
      meta:[{
        hid:'description',name:'description',content:this.description
      }]
    }
  }
}
</script>
