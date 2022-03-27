<template>
  <div>
    <form class="card comment-form" @submit.prevent="addComment">
      <div class="card-block">
        <textarea class="form-control" placeholder="Write a comment..."
          rows="3" v-model="commentBody"></textarea>
      </div>
      <div class="card-footer">
        <img :src="article.image" class="comment-author-img" alt=""/>
        <button class="btn btn-sm btn-primary">
          Post Comment
        </button>
      </div>
    </form>
    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body}}</p>
      </div>
      <div class="card-footer">
        <nuxt-link :to="{name:'profile',params:{username:comment.author.username}}"
                   class="comment-author">
          <img :src="comment.author.image" class="comment-author-img"  alt=""/>
        </nuxt-link>
        &nbsp;
        <span>{{ comment.author.username }}</span>
        <span class="date-posted">{{ comment.createdAt |date('MMM DD,YYYY') }}</span>
        <span class="mod-options" v-if="comment.author.username===user.username">
          <i class="ion-trash-a" @click="deleteComment(comment)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {deleteComment, getArticleComments, postComment} from "@/api/articles";
import {mapState} from "vuex";

export default {
  name: "article-comments",
  props:{
    article:{
      type:Object,
      required:true
    }
  },
  data(){
    return {
      comments:[],
      commentBody:''
    }
  },
  computed:{
    ...mapState(['user'])
  },
  async mounted() {
    const {data} = await getArticleComments(this.article.slug)
    this.comments = data.comments
  },
  methods:{
    async addComment(){
      if(this.commentBody.trim().length>0){
        const {data} = await postComment(this.article.slug,{comment:{body:this.commentBody}})
        console.log('resp of add comment',data)
        this.comments.unshift(data.comment)
        this.commentBody=''
      }else{
        alert('comment should not empty')
      }
    },
    async deleteComment(comment){
      const {data} = await deleteComment(this.article.slug,comment.id)
      // console.log('resp of delete comment',data)
      const targetIdx = this.comments.findIndex(item=>item.id===comment.id)
      // console.log({targetIdx})
      this.comments.splice(targetIdx,1)
    }
  }
}
</script>

<style scoped>

</style>
