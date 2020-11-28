const cookieparser = process.server ? require('cookieparser') : undefined
export const state = () => {
  return {
    user: null
  }
}

export const mutations = {
  setUser (state, user) {
    state.user = user
  }
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    let user = null
    const { cookie } = req.headers
    if (cookie) {
      try {
        const parsed = cookieparser.parse(cookie)
        user = JSON.parse(parsed.user)
      } catch (err) {}
    }
    commit('setUser', user)
  }
}