<script>
import ServiceClient from '../ServiceClient';
import { store } from '../VuexStore';
import Success from './Common/Success_Popup.vue';
import Error from './Common/ErrorPopup.vue'

export default{
    name: 'Header',
    
    
    components: {
       Success,
       Error
    },

    data() {
        return {
            isDropdownOpen: false,
            username:"",
            message:"",
            showPopup:false,
            showErrorPopup:false
        };
    },
    watch: {
        '$store.state.userData'(newValue) {
            this.username = newValue.name;
            console.log(this.username, "hello from header watch");
        },

    },
    computed: {
       hasToken(){
            console.log("token", !!localStorage.getItem("token"))
            return !!this.$store.state.userData.id
        },
        
       /* username() {
            console.log(this.$store.state)
            return this.$store.state.userData.name;
        }*/
    },
    methods:{
      
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        logOut(){
            let url ="http://127.0.0.1:8000/api/logout";
            ServiceClient.post(url).then(response => {
                localStorage.removeItem("token");
                store.commit("deleteUserData");
                store.commit("deleteUserRole");
                this.$router.push({path: "/login"});
                this.message="Logged Out Successful!"
                this.showPopup=true
                setTimeout(()=>{
                    this.showPopup=false
                },1600)
            }).catch((error) => {
                        
                if (error.response.status === 401) {
                if (error.response.data.message) {
                    this.message= error.response.data.message
                    this.showErrorPopup=true
                    setTimeout(()=>{
                        this.showErrorPopup=false
                    },4000)
                    
                }else {
                    this.message = ["Server error occurred"];
                    this.showErrorPopup=true
                    setTimeout(()=>{
                        this.showErrorPopup=false
                    },4000)
                }
            
                }
            })
        
        },      
    },
   

  
  
  
};
</script>

<template>
    <div class="header"> <!--v-if="hasToken"-->
        <a href="/home"><div class="logo">
            <img src="../assets/RegP_icons/lab-nobg.png">
            <h1><span>Pro</span>ject-Lab</h1>
        </div></a>
        <Transition name="drop">
            <Success v-if="showPopup == true" :message="message"></Success>
        </Transition>
        <Transition name="drop">
            <Error v-if="showErrorPopup == true" :message="message"></Error>
        </Transition>
        <div class="header-items">
            <ul>
                <li><a href="/home">Home</a></li>
                <li><a href="/users">Users</a></li>
                <li><a href="/notifications">Notifications</a></li>
                <li><a href="/projects">Projects</a></li>
                <li><a href="/my-tasks">My Tasks</a></li>
                <li>Statistics</li>
            </ul>
        </div>
        <div class="ui teal buttons">
            <div class="ui button" @click="editProfile"><i class="user circle icon"></i>{{username}}</div>
            <div class="ui floating dropdown icon button"  @click="toggleDropdown">
                <i class="dropdown icon"></i>
                <div class="menu" :class="{ active: isDropdownOpen }">
                   <button class="ui orange button" @click="logOut"><i class="sign-out alternate icon"></i> Log out</button>
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
        /*background-color: yellowgreen;*/
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
        /*background-color: yellowgreen;*/
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
    .header-items ul li a{
        text-decoration: none;
        color:black;
    }

    .ui.button{
        background-color: #3277cd !important;
    }
    .dropdown .menu.active{
        border:none
    }
    .ui.button:hover{
       background-color:rgb(83, 199, 237) !important;
       border: 1.5px solid rgba(20, 102, 118, 0.677);
       border-radius:5px
       
    }

</style>