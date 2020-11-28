<template>
  <div class="article-page">

    <div class="banner">
      <div class="container">

        <h1>{{ article.title }}</h1>

        <article-meta :article="article" @favorite="onFavorite" @follow="onFollow" />

      </div>
    </div>

    <div class="container page">

      <div class="row article-content">
        <div class="col-md-12">
          <div v-html="article.body"></div>
          <ul class="tah-list">
            <li v-for="tag in article.tagList" :key="tag" class="tag-default tag-pill tag-outline">{{ tag }}</li>
          </ul>
        </div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta :article="article" @favorite="onFavorite" @follow="onFollow" />
      </div>

      <div v-if="user" class="row">

        <article-comment :article="article" :user="user" />

      </div>

    </div>

  </div>
</template>

<script>
import { getArticle, addArticleFavorite, deleteArticleFavorite } from '@/api/article'
import { followUser, unfollowUser } from '@/api/profile'
import { mapState } from 'vuex'
import MarkdownIt from 'markdown-it'
import ArticleMeta from './components/articleMeta'
import ArticleComment from './components/articleComment'
export default {
  name: 'Article',
  components: {
    ArticleMeta,
    ArticleComment
  },
  async asyncData ({ params }) {
    const { slug } = params
    const { data } = await getArticle(slug)
    const { article } = data
    const md = new MarkdownIt()
    article.body = md.render(article.body)
    article.favoriteDisabled = false
    article.favoriteButtonText = article.favorited ? 'Unfavorite' : 'Favorite'
    article.author.followDisabled = false
    article.author.followButtonText = article.author.following ? 'Unfollow' : 'Follow'
    return {
      article
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async onFavorite () {
      const { favorited, slug  } = this.article
      this.article.favoriteDisabled = true
      if (favorited) {
        await deleteArticleFavorite(slug)
        this.article.favorited = false
        this.article.favoritesCount -= 1
        this.article.favoriteButtonText = 'Favorite'
      } else {
        await addArticleFavorite(slug)
        this.article.favorited = true
        this.article.favoritesCount += 1
        this.article.favoriteButtonText = 'Unfavorite'
      }
      this.article.favoriteDisabled = false
    },
    async onFollow () {
      const { following, username  } = this.article.author
      this.article.author.followDisabled = true
      if (following) {
        await unfollowUser(username)
        this.article.author.following = false
        this.article.author.followButtonText = 'Follow'
      } else {
        await followUser(username)
        this.article.author.following = true
        this.article.author.followButtonText = 'Unfavorite'
      }
      this.article.author.followDisabled = false
    }
  }
}
</script>

<style>

</style>