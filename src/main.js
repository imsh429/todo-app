// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import router from './router'

// PrimeVue CSS (v3 방식)
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// FullCalendar CSS
import '@fullcalendar/core/vdom'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'

// 커스텀 CSS
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)

app.mount('#app')
