import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')

require('./database/backend.js')
require('./database/authentication.js')
