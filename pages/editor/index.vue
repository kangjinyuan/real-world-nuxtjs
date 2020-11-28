<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                  <input v-model="article.title" type="text" class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="article.description" type="text" class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                  <textarea v-model="article.body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="tag" @keydown.enter="addTag" type="text" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
                <div class="tag-list">
                  <span v-for="tag in article.tagList" :key="tag" class="tag-default tag-pill">
                    <i class="ion-close-round"></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button @click="onSubmit" class="btn btn-lg pull-xs-right btn-primary" type="button">
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
import { createArticle } from '@/api/article'
export default {
  name: 'Editor',
  middleware: 'notLogined',
  data () {
    return {
      article: {
        title: '',
        description: '',
        body: '',
        tagList: []
      },
      tag: ''
    }
  },
  methods: {
    addTag () {
      if (this.tag) {
        this.article.tagList.push(this.tag)
        this.tag = ''
      }
    },
    async onSubmit () {
      const { title, body } = this.article
      if (!title) {
        return alert('请输入标题')
      }
      if (!body) {
        return alert('请输入内容')
      }
      await createArticle({
        article: this.article
      })
      this.$router.push('/')
    }
  }
}
</script>

<style>

</style>