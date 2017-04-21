import base64 from './base64'

let store = {
  set (key, value) {
    try {
      if (key && value) {
        value = JSON.stringify(value)
        value = base64.encode(value)
        value = encodeURIComponent(value)
      }
      window.localStorage.setItem(key, value)
    } catch (e) {
      console.log && console.log(e)
    }
  },

  get (key) {
    try {
      let value = window.localStorage.getItem(key)
      if (value) {
        value = decodeURIComponent(value)
        value = base64.decode(value)
        value = JSON.parse(value)
      }
      return value
    } catch (e) {
      console.log && console.log(e)
      return null
    }
  },

  remove (key) {
    window.localStorage.removeItem(key)
  },

  clear () {
    window.localStorage.clear()
  }
}

export default store
