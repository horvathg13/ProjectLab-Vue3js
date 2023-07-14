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
ServiceClient.post('http://127.0.0.1:8000/api/get-unread-messages').then(response => {
  console.log("getUnreadMessages",response.data);
  store.commit("getUnreadMessages", response.data);
}).catch(error =>{
  console.log(error);
});
ServiceClient.post('http://127.0.0.1:8000/api/get-buttons/14').then(response => {
  console.log("getButtons",response.data);
  
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
