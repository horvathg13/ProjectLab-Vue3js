import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './VuexStore'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import VueClickAway from "vue3-click-away";
import ServiceClient from "@/ServiceClient";

function dataPreLoader(){
    return ServiceClient.getUserRoles().then(()=>app.use(router).mount('#app'))
}
const app = createApp(App)
app.use(store)
    .use(dataPreLoader)
    .use(VueClickAway)
    .component('VueDatePicker', VueDatePicker);

