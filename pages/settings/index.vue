<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="onSubmit">
            <fieldset>
                <fieldset class="form-group">
                  <input v-model="user.image" class="form-control" type="text" placeholder="URL of profile picture">
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name" required>
                </fieldset>
                <fieldset class="form-group">
                  <textarea v-model="user.bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="user.email" class="form-control form-control-lg" type="email" placeholder="Email" required>
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="user.password" class="form-control form-control-lg" type="password" placeholder="Password" minlength="8">
                </fieldset>
                <button class="btn btn-lg btn-primary pull-xs-right" :disabled="userDisabled">
                  Update Settings
                </button>
            </fieldset>
          </form>
          <hr/>
          <button @click="quit" class="btn btn-outline-danger">Or click here to logout</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getUser, updateUser } from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  name: 'Settings',
  middleware: 'notLogined',
  data () {
    return {
      user: {},
      userDisabled: false
    }
  },
  methods: {
    async onSubmit () {
      this.userDisabled = true
      const { data } = await updateUser({
        user: this.user
      })
      const { user } = data
      this.$store.commit('setUser', user)
      Cookie.set('user', user)
      this.$router.push({
        name: 'profile',
        params: {
          username: data.user.username
        }
      })
      this.userDisabled = false
    },
    quit () {
      this.$store.commit('setUser', null)
      Cookie.remove('user')
      this.$router.push('/')
    }
  },
  async mounted () {
    const { data } = await getUser()
    this.user = data.user
  }
}
</script>

<style>

</style>