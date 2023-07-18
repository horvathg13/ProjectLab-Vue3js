<script setup>
import Header from "../src/components/Header.vue"
import ServiceClient from "./ServiceClient";
import {store} from "./VuexStore"
import ContentTitle from './components/Common/ContentTitle.vue'
 

ServiceClient.post('http://127.0.0.1:8000/api/getUserData').then(response => {
  store.commit("setUserData",response.data);
}).catch(error =>{
  console.log(error);
});

setInterval(() => {
  ServiceClient.post('http://127.0.0.1:8000/api/get-unread-messages').then(response => {
    console.log("getUnreadMessages",response.data);
    store.commit("getUnreadMessages", response.data);
  }).catch(error =>{
    console.log(error);
  });
}, 30000);

ServiceClient.post('http://127.0.0.1:8000/api/notifications').then(response => {
  console.log(response.data)
}).catch(error =>{
  console.log(error);
});
</script>

<template>
  <Header />
  <ContentTitle  :h1Title="$route.name" :route="$route.path" :meta="$route.meta"/>
  <router-view></router-view>
</template>

<style scoped>

</style>
