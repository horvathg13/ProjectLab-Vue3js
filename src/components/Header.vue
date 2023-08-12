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
            showErrorPopup:false,
            userRole:{},
            userButton:false,
            lockMode:false,
            managerButton:false
           
        };
    },
    watch: {
        '$store.state.userData'(newValue) {
            this.username = newValue.name;
            console.log(this.username, "hello from header watch");
        },
        '$store.state.userRole'(newValue) {
            this.userRole = newValue;
            console.log( this.userRole, "hello from user watcher");
            this.SetUserButton();
        }

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
        SetUserButton(){
            if(this.userRole.code ?? this.userRole.code == 404){
                this.lockMode = true
                
            }else{
                for(let i in this.userRole){
                    if(this.userRole[i].role=="Admin"){
                        this.lockMode = false
                        this.userButton=true
                    }else if(this.userRole[i].role=="Manager"){
                        this.lockMode = false
                        this.managerButton=true
                    }
            
                }
            }
            
           
            
        },
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        logOut(){
            let url ="/api/logout";
            ServiceClient.post(url).then(response => {
                localStorage.removeItem("token");
                store.commit("deleteUserData");
                store.commit("deleteUserRole");
                store.commit("deleteNotifications");
                this.$router.push({path: "/login"});
                this.message="Logged Out Successful!"
                this.showPopup=true
                this.lockMode=true
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
        /*getUserRoles(){
            ServiceClient.post('/api/getUserRole').then(response => {
                store.commit("setuserRole",response.data)
                console.log(response.data, "getUserRole");
            }).catch(error =>{
            console.log(error);
            });
        }*/
        home(){
            this.$router.push('/home')
        },
        users(){
            this.$router.push('/users')
        },
        notifications(){
            this.$router.push('/notifications')
        },
        projects(){
            this.$router.push('/projects')
        },
        fprojects(){
            this.$router.push('/favorite-projects')
        },
        mytasks(){
            this.$router.push('/my-tasks')
        },
        managerDb(){
            this.$router.push('/manager-dashboard')
        },
    },
    beforeMount() {
        this.SetUserButton();
    },
    mounted(){
       
    }
   

  
  
  
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
                <li v-if="lockMode==false" @click="home">Home</li>
                <li v-if="userButton == true && lockMode==false" @click="users">Users</li>
                <li v-if="lockMode==false" @click="notifications">Notifications</li>
                <li v-if="lockMode==false" @click="projects">Projects</li>
                <li v-if="lockMode==false" @click="fprojects">Favorite Projects</li>
                <li v-if="lockMode==false" @click="mytasks">My Tasks</li>
                <li v-if="managerButton===true && lockMode==false" @click="managerDb">Manager Dashboard</li>
                <!--<li v-if="lockMode==false">Statistics</li>-->
            </ul>
        </div>
        <div class="ui teal buttons" >
            <div class="ui button" @click="editProfile"><i class="user circle icon"></i>{{username}}</div>
            <div class="ui floating dropdown icon button"  @click="toggleDropdown">
                <i class="dropdown icon"></i>
                <div  class="menu" :class="{ active: isDropdownOpen }" >
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