<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">拉钩教育</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link :to="{
                  name: 'home',
                  query: {
                    tab: 'your_feed'
                  }
                }" exact class="nav-link" :class="{ active: tab === 'your_feed' }">Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link :to="{
                  name: 'home',
                  query: {
                    tab: 'global_feed'
                  }
                }" exact class="nav-link" :class="{ active: tab === 'global_feed' }">Global Feed</nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link :to="{
                  name: 'home',
                  query: {
                    tab: 'tag'
                  }
                }" class="nav-link" :class="{ active: tab === 'tab' }">#{{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <div v-for="article in articles" :key="article.slug" class="article-preview">
            <div class="article-meta">
              <nuxt-link :to="{
                name: 'profile',
                params: {
                  username: article.author.username
                }
              }">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }">
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | formatDate('MMM DD, YYYY') }}</span>
              </div>
              <button @click="onFavorite(article)" class="btn btn-outline-primary btn-sm pull-xs-right" :class="{ active: article.favorited }" :disabled="article.favoriteDisabled">
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link :to="{
              name: 'article',
              params: {
                slug: article.slug
              }
            }" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li v-for="tag in article.tagList" :key="tag" class="tag-default tag-pill tag-outline">{{ tag }}</li>
              </ul>
            </nuxt-link>
          </div>

          <!-- 分页 -->
          <nav>
            <ul class="pagination">
              <li v-for="item in totalPage" :key="item" class="page-item" :class="{ active: page === item }">
                <nuxt-link :to="{
                  name: 'home',
                  query: {
                    page: item,
                    tag,
                    tab
                  }
                }" class="page-link">{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>

        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link v-for="tag in tags" :key="tag" :to="{
                name: 'home',
                query: {
                  tag,
                  tab: 'tag'
                }
              }" class="tag-pill tag-default">
                {{ tag }}
              </nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { getArticles, getFeedArticles, addArticleFavorite, deleteArticleFavorite } from '@/api/article'
import { getTags } from '@/api/tag'
export default {
  name: 'Home',
  watchQuery: ['page', 'tag', 'tab'],
  async asyncData ({ query, store }) {
    const { page = 1, tag, tab = 'global_feed' } = query
    const limit = 10
    const offset = (page - 1) * limit
    const getArticlesFn = tab === 'your_feed' ? getFeedArticles : getArticles
    const [articleData, tagData] = await Promise.all([
      getArticlesFn({
        limit,
        offset,
        tag
      }),
      getTags()
    ])
    const { articles, articlesCount } = articleData.data
    articles.forEach(article => {
      article.favoriteDisabled = false
    })
    const totalPage = Math.ceil(articlesCount / limit)
    const { tags } = tagData.data
    return {
      articles,
      tags,
      page,
      totalPage,
      tag,
      tab,
      user: store.state.user
    }
  },
  methods: {
    async onFavorite (article) {
      const { favorited, slug } = article
      article.favoriteDisabled = true
      if (favorited) {
        await deleteArticleFavorite(slug)
        article.favoritesCount -= 1
        article.favorited = false
      } else {
        await addArticleFavorite(slug)
        article.favoritesCount += 1
        article.favorited = true
      }
      article.favoriteDisabled = false
    }
  }
}
</script>

<style>

</style>