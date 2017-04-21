<template>
  <login
  :app-id="appId"
  :device-id="deviceId"
  :old-prefix="oldPrefix"
  :prefix="prefix"></login>
</template>
<script>
import Login from '../components/Login/index.vue'
  export default {
    components: {
      Login
    },
    data () {
      return {
        appId: '56c6c309243cb728205a3dff',
        deviceId: '151a7387-e961-4c9b-ba0d-4ca1af0660c3',
        oldPrefix: 'http://api-saas-dev.tinfinite.com',
        prefix: 'http://api-saas-dev.tinfinite.com'
      }
    }
  }
</script>
