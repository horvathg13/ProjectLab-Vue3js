<script setup>
import Header from "../src/components/Header.vue"
import ServiceClient from "./ServiceClient";
import {store} from "./VuexStore"
import ContentTitle from './components/Common/ContentTitle.vue'
 
ServiceClient.post('/api/get-unread-messages').then(response => {
  store.commit("getUnreadMessages", response.data);
}).catch(error =>{
  console.log(error);
});

ServiceClient.post('/api/getUserData').then(response => {
  store.commit("setUserData",response.data);
}).catch(error =>{
  console.log(error);
});

setInterval(() => {
  ServiceClient.post('/api/get-unread-messages').then(response => {
    store.commit("getUnreadMessages", response.data);
  }).catch(error =>{
    console.log(error);
  });
}, 30000);



ServiceClient.post('/api/notifications').then(response => {
  store.commit("getNotifications",response.data);
}).catch(error =>{
  console.log(error);
});

ServiceClient.post('/api/get-manager-notification').then(response => {
  store.commit("getManagerNotifications",response.data);
}).catch(error =>{
  console.log(error);
});

ServiceClient.post('/api/getUserRole').then(response => {
  store.commit("setuserRole",response.data)
}).catch(error =>{
  console.log(error);
});


</script>

<template>
  <Header />
  <ContentTitle  :h1Title="$route.name" :route="$route.path" :meta="$route.meta.breadcrumbs" />
  <router-view></router-view>
</template>

<style scoped>

</style>
