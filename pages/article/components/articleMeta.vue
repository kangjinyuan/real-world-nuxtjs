<template>
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
      }" class="author">
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | formatDate('MMM DD, YYYY') }}</span>
    </div>
    <button @click="onFollow" :disabled="article.author.followDisabled" class="btn btn-sm btn-outline-secondary" :class="{ active: article.author.following }">
      <i class="ion-plus-round"></i>
      &nbsp;
      {{ article.author.followButtonText }} {{ article.author.username }}
    </button>
    &nbsp;&nbsp;
    <button @click="onFavorite" :disabled="article.favoriteDisabled" class="btn btn-sm btn-outline-primary" :class="{ active: article.favorited }">
      <i class="ion-heart"></i>
      &nbsp;
      {{ article.favoriteButtonText }} Article <span class="counter">({{ article.favoritesCount }})</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  methods: {
    onFavorite () {
      this.$emit('favorite') 
    },
    onFollow () {
      this.$emit('follow')
    }
  }
}
</script>

<style>

</style>