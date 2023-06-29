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
    <div class="header"> <!--v-if="hasToken"-->
        <div class="logo">
            <img src="../assets/RegP_icons/lab-nobg.png">
            <h1><span>Pro</span>ject-Lab</h1>
        </div>
        <div class="header-items">
            <ul>
                <li>Home</li>
                <li>Users</li>
                <li>Notifications</li>
                <li>Projects</li>
                <li>My Tasks</li>
                <li>Statistics</li>
            </ul>
        </div>
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

<style scoped>
    .header{
        display: flex;
        justify-content: space-between;
        background-color: rgba(255,255,255,.5);
    }
    .logo{
        display: flex;
        background-color: yellowgreen;
        color:white;
        min-width: 230px;
        border-radius:5px;
    
    }
    .logo h1{
        margin:auto;
        
    }
    .header img{
        max-width: 70px;
        max-height:60px;
        background-color: yellowgreen;
    }

    .header-items ul li{
        display: inline-flex;
        justify-content: space-between;
        padding: 15px 30px;

    }
    .header-items ul li:hover{
        background-color: yellowgreen;
        cursor: pointer;
        border-radius: 10px;
        font-weight: bold;
        color: white;
    }


   

</style>