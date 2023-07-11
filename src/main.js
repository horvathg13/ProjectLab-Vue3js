import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './VuexStore'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import VueClickAway from "vue3-click-away";


const app = createApp(App)
app.use(router).use(store).use(VueClickAway).component('VueDatePicker', VueDatePicker);


app.mount('#app')
