<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset :disabled="isPublishing">
              <fieldset class="form-group">
                <input type="text" class="form-control form-control-lg"
                       v-model="title"
                       placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                <input type="text" class="form-control"
                       v-model="description"
                       placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control" rows="8"
                          v-model="body"
                          placeholder="Write your article (in markdown)"></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input type="text"
                         v-model="tagListContent"
                         @keyup.enter="addToTagList"
                         class="form-control" placeholder="Enter tags">
                  <div class="tag-list">
                    <span class="tag-default tag-pill" :key="tag" v-for="tag in tagList">
                      <i class="ion-close-round" @click="removeTag(tag)"></i>
                      {{ tag }}
                    </span>
                  </div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary"
                      @click="publish"
                      type="button">
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import isEmpty from "@/utils/isEmpty";
import {publishArticle} from "@/api/articles";
export default {
  middleware:'auth',
  name:'editor',
  data(){
    return {
      //"article": {
        "title": "",
        "description": "",
        "body": "",
        "tagList": [],
      //},
      tagListContent:'',
      isPublishing:false
    }
  },
  methods:{
    async publish(){
      console.log('publish run ')
      if(isEmpty(this.title)){
        alert('title is empty')
        return
      }if(isEmpty(this.description)){
        alert('description is empty')
        return
      }if(isEmpty(this.body)){
        alert('body is empty')
        return
      }
      this.isPublishing = true
      const {data} = await publishArticle({
        article:{
          "title": this.title,
          "description": this.description,
          "body": this.body,
          "tagList": this.tagList,
        }
      });
      console.log(data.article)
      this.isPublishing = false
      await this.$router.push('/article/' + data.article.slug)
    },
    removeTag(tag){
      const targetIdx = this.tagList.findIndex(item=>item===tag)
      this.tagList.splice(targetIdx,1);
    },
    addToTagList(){
      const tagInput = this.tagListContent.trim();
      if(tagInput.length>0){
        const targetIdx = this.tagList.findIndex(item=>item===tagInput)
        if(targetIdx<0){
          this.tagList.push(tagInput);
          this.tagListContent=''
        }
      }
    }
  }
}
</script>
