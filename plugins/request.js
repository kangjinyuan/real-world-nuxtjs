import axios from 'axios'

export const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

export default ({ store, redirect }) => {
  request.interceptors.request.use(config => {
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }
    return config
  }, err => {
    return Promise.reject(err)
  })

  request.interceptors.response.use(res => {
    return res
  }, err => {
    const { status } = err.response
    if (status === 401) {
      return redirect('/login')
    }
    return Promise.reject(err)
  })
}