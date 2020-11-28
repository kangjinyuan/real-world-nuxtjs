<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button @click="onFollow" class="btn btn-sm btn-outline-secondary action-btn" :class="{ active: profile.following }" :disabled="profile.followDisabled">
              <i class="ion-plus-round"></i>
              &nbsp;
              {{ profile.followButtonText }} {{ profile.username }}
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
                <nuxt-link :to="{
                  name: 'profile',
                  params: {
                    username: profile.username
                  },
                  query: {
                    tab: 'my_articles'
                  }
                }" exact class="nav-link" :class="{ active: tab === 'my_articles' }">
                  My Articles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link :to="{
                  name: 'profile',
                  params: {
                    username: profile.username
                  },
                  query: {
                    tab: 'favorited_articles'
                  }
                }" exact class="nav-link" :class="{ active: tab === 'favorited_articles' }">
                  Favorited Articles
                </nuxt-link>
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
            <a href="" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li v-for="tag in article.tagList" :key="tag" class="tag-default tag-pill tag-outline">{{ tag }}</li>
              </ul>
            </a>
          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { getProfile } from '@/api/profile'
import { getArticles, addArticleFavorite, deleteArticleFavorite } from '@/api/article'
import { followUser, unfollowUser } from '@/api/profile'
export default {
  name: 'Profile',
  middleware: 'notLogined',
  watchQuery: ['tab'],
  async asyncData ({ query, params }) {
    const { tab = 'my_articles' } = query
    const { username } = params
    const { data: profileData } = await getProfile(username)
    const { profile } = profileData
    profile.followDisabled = false
    profile.followButtonText = profile.following ? 'Unfollow' : 'Follow'
    const { data: articlesData } = await getArticles(tab === 'my_articles' ? {
      author: profile.username
    } : {
      favorited: profile.username
    })
    const { articles } = articlesData
    articles.forEach(article => {
      article.favoriteDisabled = false
    })
    return {
      profile,
      articles,
      tab
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
    },
    async onFollow () {
      const { following, username  } = this.profile
      this.profile.followDisabled = true
      if (following) {
        await unfollowUser(username)
        this.profile.following = false
        this.profile.followButtonText = 'Follow'
      } else {
        await followUser(username)
        this.profile.following = true
        this.profile.followButtonText = 'Unfavorite'
      }
      this.profile.followDisabled = false
    }
  }
}
</script>

<style>

</style>