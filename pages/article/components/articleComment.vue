<template>
  <div class="col-xs-12 col-md-8 offset-md-2">

    <form @submit.prevent="onSubmit" class="card comment-form">
      <div class="card-block">
        <textarea v-model="comment.body" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">
        Post Comment
        </button>
      </div>
    </form>
    
    <div v-for="comment in comments" :key="comment.id" class="card">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link :to="{
          name: 'profile',
          params: {
            username: comment.author.username
          }
        }" class="comment-author">
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link :to="{
          name: 'profile',
          params: {
            username: comment.author.username
          }
        }">
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ comment.createdAt | formatDate('MMM DD, YYYY') }}</span>
        <span @click="deleteComment(comment)" class="mod-options">
          <i class="ion-trash-a"></i>
        </span>
      </div>
    </div>
    
  </div>
</template>

<script>
import { getComments, addComment, deleteComment } from '@/api/article'
export default {
  name: 'ArticleComment',
  props: {
    article: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      comments: [],
      comment: {
        body: ''
      }
    }
  },
  methods: {
    async onSubmit () {
      const { body } = this.comment
      if (!body) {
        return alert('请输入评论内容')
      }
      const { data } = await addComment(this.article.slug, this.comment)
      this.comments.unshift(data.comment)
      this.comment.body = ''
    },
    async deleteComment (comment) {
      const { id } = comment
      await deleteComment(this.article.slug, comment.id)
      const index = this.comments.findIndex(item => item.id === id)
      this.comments.splice(index, 1)
    }
  },
  async mounted () {
    const { data } = await getComments(this.article.slug)
    this.comments = data.comments
  }
}
</script>

<style>

</style>