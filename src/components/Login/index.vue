<template>
  <div class="module-login" id="yauoi-login">
    <div class="wrap">
      <div class="bg" style="background-image: url(https://o4a7cbihz.qnssl.com/cover/8bfba500-55fc-447c-8ae3-fcd4bbaa1891);"></div>
      <div class="load">
        <div v-show="showLogin" class="loading">
          <div v-show="showQRCodeBox" class="QR_create">
            <div v-show="showLoadingQRCode" class="load_box"><img src="../../assets/loading.gif" alt="" /></div>
            <div v-show="showQRCode" id="qrcode" class="QR_code"></div>
            <p class="QR_p">扫描登录</p>
          </div>
          <div v-show="showRenovate" class="QR_renovate">
            <div><a @click="cancelLogin" href="javascript:;">刷新</a></div>
            <p>校验二维码失败，请刷新</p>
          </div>
          <div class="massage">
            <div class="install">
              <div class="mobile_icon">
                <img src="../../assets/xs_m.png" alt="">
              </div>
                <div class="install_title">
                  <p class="massage_p">打开手机新生大学应用</p>
                  <p class="massage_s">手机上<a class="massage_a" target="_blank" href="javascript:;">安装</a>并登录新生大学应用</p>
                </div>
              </div>
            <i class="adown_tip" style="background: url(https://o4a7cbihz.qnssl.com/cover/4d2af1ce-0bee-42c2-9eed-ff35281a405c) no-repeat center;"></i>
            <div class="sweep">
              <div class="sweep_icon">
                <img src="../../assets/xs_s.png" alt="">
              </div>
              <div class="sweep_title">
                <p class="massage_p">进入「扫一扫」</p>
                <p class="massage_s">从"发现"进入扫一扫，扫码登录</p>
              </div>
            </div>
          </div>
          <a style="background: url(https://o4a7cbihz.qnssl.com/cover/b90287d7-40b4-4087-902f-61a3b969ab03) no-repeat;"
          class="tab_btn" href="javascript:;" @click="tabLoginStyle">切换</a>
        </div>
          <!--扫描成功-->
        <div v-show="showScanSuccess" class="success">
          <div class="user">
            <img id="avatar" src="../../assets/user_avatar.png" alt="头像">
          </div>
          <p class="success_massage1">扫描成功</p>
          <p class="success_massage2">请在手机上点击确认登陆</p>
          <button class="success_btn" @click="cancelLogin">返回</button>
        </div>
      </div>
      <div class="phone_login">
        <div class="phone_box">
          <div class="txt_box">
            <p>手机号：</p>
            <input class="phone_num" type="text" placeholder="请输入手机号" />
          </div>
          <div class="txt_box">
            <p>验证码：</p>
            <div>
              <input class="identify_code" type="text" placeholder="请输入验证码" />
              <a class="indentify_btn" href="javascript:;" @click="getIdentifyingCode">获取验证码</a>
            </div>
          </div>
          <a class="phonic_tip" href="javascript:;" @click="Voice">未收到短信？获取语音验证码</a>
          <a class="login_btn" href="javascript:;" @click="SignIn">登录</a>
        </div>
        <a
        style="background: url(https://o4a7cbihz.qnssl.com/cover/b90287d7-40b4-4087-902f-61a3b969ab03) no-repeat;"
        class="tab_btn" href="javascript:;" @click="tabLoginStyle">切换</a>
      </div>
    </div>
  </div>
</template>

<script>

  import $ from 'jquery'
  import QRCode from '../../base/qrcode'
  import cookie from '../../base/cookie'
  import base64 from '../../base/base64'

  const loc = window.location
  const host = loc.host
  const topHostMatch = loc.hostname.match(/.([^.]+.com)$/)
  const TOP_LEVEL_HOST = topHostMatch && topHostMatch[1]
  const _hostInfo = host.split('.')
  // 得到该结构：["cms-saas-dev", "tinfinite", "com:8080"]
  const TYPE = _hostInfo[0].split('-')[0]
  const ENV =  _hostInfo[0].split('-')[2] ? _hostInfo[0].split('-')[2] : 'pro'
  let deviceInfo = TYPE === 'cms' ? 'cms' : ''

  export default {
    name: 'login',
    props: {
      appId: {
        type: String,
        default: '',
        required: true
      },
      deviceId: {
        type: String,
        default: '',
        required: true
      },
      oldPrefix: {
        type: String,
        default: '',
        required: true
      },
      prefix: {
        type: String,
        default: '',
        required: true
      }
    },
    data () {
      return {
        showLogin: true,          // 登录模块
        showScanSuccess: false,   // 登录成功模块
        showQRCodeBox: true,      // 创建二维码成功后显示的状态
        showRenovate: false,      // 创建二维码失败后显示的状态
        LoginStatus: false,       // 切换二维码和手机号码登录状态
        IdentifyStatus: false,    // 验证码发送状态
        showLoadingQRCode: true,  // 二维码加载之前状态
        showQRCode: false,        // 二维码显示
        // deviceId: '',
        qr: '',
        checkSubmitLogin: null,
        IdentifyingCode: '',
        checkSublimeStatus: 0     // 轮询请求状态，若发生变化怎做出相应的改动
      }
    },
    created () {
      // 默认APP_ID是新生大学,存在TOKEN中
      cookie.setCookie('_app_id', this.appId, TOP_LEVEL_HOST, 30)

      // this.getDeviceId();
      this.getQr(this.deviceId)
    },
    watch: {
      qr () {
        let qrCodeEle = $('#qrcode')[0]
        if (!qrCodeEle) {
          return false
        }
        $('#qrcode').html('')
        /* eslint-disable no-new */
        new QRCode.QRCode(qrCodeEle, {
          text: this.oldPrefix + '/v3/r?qr=' + this.qr,
          width: 196,
          height: 196,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.QRCode.CorrectLevel.H
        })
        this.showLoadingQRCode = false
        this.showQRCode = true
        this.checkClientSubmitLogin()
      },
      checkSublimeStatus () {
        let data = this.checkSubmitLogin
        switch (data.code) {
          case 0:     // 二维码创建失败或失效
            this.getQr()
            break
          case 100:   // 等待扫码时轮询超时，需重新发起轮询
            this.checkClientSubmitLogin()
            break
          case 101:   // 移动端扫码成功，需重新发起轮训等待移动端确认登录
            this.showLogin = false
            this.showScanSuccess = true
            this.showLoadingQRCode = true
            this.showQRCode = false
            $('#qrcode').html('')
            let avatar = data.data.avatar
            if (avatar) {
              $('#avatar').attr('src', avatar)
            }
            this.checkClientSubmitLogin()
            break
          case 200:   // 等待确认轮训超时，需重新发起轮询
            this.checkClientSubmitLogin()
            break
          case 201:   // 移动端确认登录
            this.saveUserInfo(data.data)
            this.loginSuccess()
            break
          case 204:   // 移动端取消登录，需重新创建二维码
            this.showLogin = true
            this.showScanSuccess = false
            this.getQr(this.deviceId)
            break
        }
      }
    },
    methods: {
      xsdxLogin () {
        this.appId = '56c6c309243cb728205a3dff'
        cookie.setCookie('_app_id', this.appId, TOP_LEVEL_HOST, 30)
        this.getQr(this.deviceId)
      },
      fkLogin () {
        this.appId = '56971892243cb728205a20df'
        cookie.setCookie('_app_id', this.appId, TOP_LEVEL_HOST, 30)
        this.getQr(this.deviceId)
      },
      // getDeviceId () {
      //   let deviceId = store.get(DEVICE_ID_KEY)
      //   if (!deviceId) {
      //     // deviceId = UUID.v4()
      //     cookie.setCookie(DEVICE_ID_KEY, deviceId, TOP_LEVEL_HOST, 30)
      //     store.set(DEVICE_ID_KEY, deviceId)
      //   }
      //   this.deviceId = deviceId
      // },
      getQr (deviceId) {
        $.ajax({
          type: 'post',
          url: this.prefix + '/v3/l',
          dataType: 'json',
          // noToken: true,
          headers: {
            'x-app-id': this.appId,
            'x-device-info': base64.encode(JSON.stringify({platform: deviceInfo}))
          },
          data: {
            device_id: this.deviceId
          },
          success: (data) => {
            if (data.code === 1) {
              this.qr = data.result
            }
          },
          fail: (error) => {
            console.log(error)
          }
        }, true)
      },
      checkClientSubmitLogin () {
        let qr = this.qr

        $.ajax({
          type: 'get',
          url: this.prefix + '/v3/l',
          dataType: 'json',
          noToken: true,
          headers: {
            'x-app-id': this.appId,
            'x-device-info': base64.encode(JSON.stringify({platform: deviceInfo}))
          },
          data: {
            qr: qr,
            device_id: this.deviceId
          },
          success: (data) => {
            this.checkSubmitLogin = data
            this.checkSublimeStatus++
          },
          fail: (error) => {
            console.log(error)
          }
        }, true)
      },
      cancelLogin () {
        this.showLogin = true
        this.showScanSuccess = false
        this.showRenovate = false
        this.showQRCodeBox = true
        this.getQr(this.deviceId)
      },
      saveUserInfo (userInfo) {
        // store.set(USER_INFO_KEY, userInfo)
        let env = ENV === 'pro' ? '' : '_' + ENV
        cookie.setCookie(`_app_token${env}`, userInfo.token, TOP_LEVEL_HOST, 30)
        cookie.setCookie(`_user_id${env}`, userInfo.id, TOP_LEVEL_HOST, 30)
      },
      loginSuccess () {
        // this.$dispatch('logined')
        let env = ENV === 'pro' ? '' : '_' + ENV
        cookie.setCookie(`login_success${env}`, 1, TOP_LEVEL_HOST, 30)
      },
      tabLoginStyle () {
        if (!this.LoginStatus) {
          $('.load').css({'opacity': '0', 'zIndex': '-1'})
          $('.phone_login').css({'opacity': '1', 'zIndex': '1'})
          $('.tab_btn').css('backgroundPosition', '0 0')
        } else {
          $('.phone_login').css({'opacity': '0', 'zIndex': '-1'})
          $('.load').css({'opacity': '1', 'zIndex': '1'})
          $('.tab_btn').css('backgroundPosition', '-40px -40px')
        }
        this.LoginStatus = !this.LoginStatus
      },
      getIdentifyingCode () {
        if (!this.IdentifyStatus) {
          let phone = $('.phone_num').val()

          if (!(/^1[3|4|5|7|8]\d{9}$/.test(phone))) {
            window.alert('手机号码有误，请重填!')
            return false
          }

          let type = 0

          $.ajax({
            type: 'get',
            url: this.prefix + '/v3/passport/send-code',
            dataType: 'json',
            // noToken: true,
            headers: {
              'x-app-id': this.appId
            },
            data: {
              phone: phone,
              type: type,
              country_code: 'CN'
            },
            success: (data) => {
              if (data.code !== 0) {
                this.IdentifyingCode = data.result.key
                this._checkIdentifyStatus()
              } else {
                window.alert(data.message)
              }
            },
            fail: (error) => {
              console.error('getIdentifyingCode:', error)
            }
          }, true)
        }
      },
      _checkIdentifyStatus () {
        this.IdentifyStatus = true
        let i = 60
        let timer = setInterval(() => {
          $('.indentify_btn').html(i + '秒后重新获取')
          $('.indentify_btn').css('opacity', '.55')
          i--
          if (i === 45) {
            $('.phonic_tip').css('display', 'block')
          }
          if (i === 0) {
            clearInterval(timer)
            this.IdentifyStatus = false
            $('.indentify_btn').css('opacity', '1')
            $('.indentify_btn').html('获取验证码')
          }
        }, 1000)
      },
      SignIn () {
        let phone = $('.phone_num').val()
        let code = $('.identify_code').val()

        if (!phone || !code) {
          window.alert('请输入手机号或验证码！')
          return false
        }

        let data = {
          code: code,
          phone: phone,
          key: this.IdentifyingCode,
          device_id: this.deviceId,
          country_code: 'CN'
        }

        $.ajax({
          type: 'post',
          url: this.prefix + '/v3/passport/sign-in',
          dataType: 'json',
          // noToken: true,
          headers: {
            'x-app-id': this.appId
          },
          data: data,
          success: (data) => {
            if (data.code === 0) {
              window.alert(data.message)
              return false
            }
            this.saveUserInfo(data.result)
            this.loginSuccess()
          },
          fail: (error) => {
            console.error('loginSuccess:', error)
          }
        }, true)
      },
      Voice () {
        let phone = $('.phone_num').val()
        $('.phonic_tip').css('display', 'none')

        $.ajax({
          type: 'get',
          url: this.prefix + '/v3/passport/send-voice',
          dataType: 'json',
          // noToken: true,
          headers: {
            'x-app-id': this.appId
          },
          data: {
            phone: phone,
            country_code: 'CN'
          },
          success: (data) => {
            console.log(data)
          },
          fail: (error) => {
            console.error('loginSuccess:', error)
          }
        })
      }
    }
  }
</script>
