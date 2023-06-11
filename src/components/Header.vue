<script>
import ServiceClient from '../ServiceClient';
import { store } from '../VuexStore';

export default{
    name: 'Header',
    
    
    methods: {
       
    },
    data() {
        return {
            isDropdownOpen: false,
            
        };
    },
    computed: {
       hasToken(){
            console.log("token", !!localStorage.getItem("token"))
            return !!this.$store.state.userData.id
        }
    },
    methods:{
      
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        async logOut(){
            let url ="http://127.0.0.1:8000/api/logout";
            ServiceClient.post(url)
            localStorage.removeItem("token");
            store.commit("deleteUserData");
            store.commit("deleteUserRole");
            this.$router.push({path: "/login"});
            alert("Logged Out Successful!");
        }
    },
   

  
  
  
};
</script>

<template>
    <div class="header" v-if="hasToken">
        <div class="ui teal buttons">
            <div class="ui button" @click="editProfile"><i class="user circle icon"></i>Profile</div>
            <div class="ui floating dropdown icon button" ref="dropdown" @click="toggleDropdown">
                <i class="dropdown icon"></i>
                <div class="menu" :class="{ active: isDropdownOpen }">
                    <div class="item" @click="logOut"><i class="sign-out alternate icon"></i> Log out</div>
                </div>
            </div>
        </div>
    </div>
</template>