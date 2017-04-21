import Vue from 'vue'
import Alert from './components/Alert/index.vue'

const elm = document.createElement('div');
elm.id = 'app' + '01';
document.body.appendChild(elm);

const vm = new Vue({
  el: '#app01',
  components: {Alert},
  template: `<Alert :para="{
                            content: '内容我是内容',
                            title: '标题我是标题',
                            type: 'alert',
                            confirm: '确定辣',
                            cancel: '取消辣',
                            close: true,
                            showStatus: true,
                          }" />`
})

