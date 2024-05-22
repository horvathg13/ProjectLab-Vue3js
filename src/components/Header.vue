<script>
import ServiceClient from '../ServiceClient';
import { store } from '../VuexStore';
import Success from './Common/Success_Popup.vue';
import Error from './Common/ErrorPopup.vue';
import Profile from './Modals/ProfileModal.vue';
import router from "@/router";
export default{
    name: 'Header',
    
    
    components: {
       Success,
       Error,
       Profile
    },

    data() {
        return {
            isDropdownOpen: false,
            message:"",
            showPopup:false,
            showErrorPopup:false,
            userRole:{},
            userButton:false,
            lockMode:false,
            managerButton:false,
            show_Profile_Modal:false,
            userData:{},
            errorArray:[],
            tryAgain:Boolean,
            openMenu:false
        };
    },
    watch: {
        '$store.state.userData'(newValue) {
            this.userData = newValue;
        },
        '$store.state.userRole'(newValue) {
            this.userRole = newValue;
        }
    },
   
    computed: {
        hasToken() {
            return !!localStorage.getItem("token");
            //return !!this.$store.state.userData.id
        },
       
        buttonLockControll(){
            const haveToken = localStorage.getItem("token");
            const lock = this.userRole.code ? this.userRole.code === 404:false;
            return  !haveToken || (haveToken && lock);

        },
        managerButtonControll(){
            const userRoles = Object.values(this.userRole);
            return  userRoles.some((role)=>role.role==='Manager');
        },
        adminButtonControll(){
            const userRoles = Object.values(this.userRole);
            return  userRoles.some((role)=>role.role==='Admin');
        },
       
        
    },
    methods:{
        toggleDropdown() {
            if(!!localStorage.getItem("token")===true){
                this.isDropdownOpen = !this.isDropdownOpen;
            }
        },
        openMobileMenu(){
          this.openMenu=!this.openMenu
        },
        logOut(){
            if(!!localStorage.getItem("token")===true){
                let url ="/api/logout";
                ServiceClient.post(url).then(response => {
                    localStorage.removeItem("token");
                    store.commit("deleteUserData");
                    store.commit("deleteUserRole");
                    store.commit("deleteNotifications");
                    store.commit("deleteManagerNotifications");
                    this.$router.push({path: "/login"});
                    this.message="Logged Out Successful!"
                    this.showPopup=true
                    this.lockMode=true
                    setTimeout(()=>{
                        this.showPopup=false
                    },1600)
                }).catch((error) => {
                            
                    if (error.response ?? error.response.status === 401) {
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
            
            }
        },
            
        
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
            this.$router.push({name:'Projects', path:'/projects'})
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
        profileModalSwitch(){
            if(!!localStorage.getItem("token")===true){
                this.show_Profile_Modal = !this.show_Profile_Modal
            }
            
            
        },
        saveProfileData(arriveData){
            const{name, email}=arriveData
            let dataTravel={};
            dataTravel.name=arriveData.name,
            dataTravel.email=arriveData.email
            store.commit("setUserData",arriveData)
            let url='/api/save-profile-data';
            ServiceClient.post(url,dataTravel).then(response => {
                if(response.status===200){
                    this.message=response.data.message
                    this.showPopup=true
                    //this.getUserData();
                    setTimeout(()=>{
                        this.showPopup=false
                        this.show_Profile_Modal=false;
                        this.message=""
                    },1600)
                }
                
            }).catch((error) =>{
                if (error.response && error.response.status) {
                    if(error.response.data.validatorError){
                        this.errorArray=error.response.data.validatorError
                        this.showErrorPopup =true
                        this.tryAgain=true,
                        setTimeout(() => {
                            this.showErrorPopup  = false
                            this.errorArray=[];
                            this.tryAgain=false;
                        },  2000)
                    }
                    if (error.response.data && error.response.data.message) {
                        this.message= error.response.data.message
                        this.showErrorPopup  = true
                        setTimeout(() => {
                            this.showErrorPopup = false
                            this.message="";
                        },  2000)
                        
                    }
                }
            });
        },
        setNotifications(){
            this.userData = this.$store.state.userData,
            this.userRole = this.$store.state.userRole

        }
    },
    beforeMount() {
        //this.SetUserButton();
    },
    mounted(){
        this.setNotifications();

    }
   

  
  
  
};
</script>

<template>
    <div class="header">
        <a href="/home"><div class="logo">
            <img src="../assets/RegP_icons/lab-nobg_v2.png">
            <h1><span>Pro</span>ject-Lab</h1>
        </div></a>
        <Transition name="drop">
            <Success v-if="showPopup == true" :message="message"></Success>
        </Transition>
        <Transition name="drop">
            <Error v-if="showErrorPopup == true" :message="message" :errorarray="this.errorArray"></Error>
        </Transition>

        <div className="mobile-menu">
          <i class="list ul icon mainIcon" @click="this.openMobileMenu()"></i>
            <Transition name="mobileMenuTransition">
              <div class="menu" v-if="this.openMenu===true && !buttonLockControll">
                <div class="closeBtn"><i class="close icon" @click="this.openMobileMenu()"></i></div>
                <router-link to="/home"><li @click="openMobileMenu">Home</li></router-link>
                <router-link to="/users"><li @click="openMobileMenu" v-if="adminButtonControll">Users</li></router-link>
                <router-link to="/notifications"><li @click="openMobileMenu"  >Notifications</li></router-link>
                <router-link to="/projects"><li @click="openMobileMenu">Projects</li></router-link>
                <router-link to="/favorite-projects"><li @click="openMobileMenu">Favorite Projects</li></router-link>
                <router-link to="/my-tasks"><li @click="openMobileMenu">My Tasks</li></router-link>
                <router-link to="/manager-dashboard"><li @click="openMobileMenu" v-if="managerButtonControll" >Manager</li></router-link>
                <li @click="profileModalSwitch(); openMobileMenu()">{{userData.name}}</li>
                <li @click="logOut(); openMobileMenu()">Logout</li>
                  <!--<li v-if="lockMode==false">Statistics</li>-->
              </div>
            </Transition>
        </div>

        <div class="header-items" v-if="!buttonLockControll">
            <ul>
              <router-link to="/home"><li>Home</li></router-link>
              <router-link to="/users"><li v-if="adminButtonControll">Users</li></router-link>
              <router-link to="/notifications"><li  >Notifications</li></router-link>
              <router-link to="/projects"><li >Projects</li></router-link>
              <router-link to="/favorite-projects"><li >Favorite Projects</li></router-link>
              <router-link to="/my-tasks"><li >My Tasks</li></router-link>
              <router-link to="/manager-dashboard"><li v-if="managerButtonControll" >Manager</li></router-link>
                <!--<li v-if="lockMode==false">Statistics</li>-->
            </ul>
        </div>
        <div class="ui teal buttons userControl" v-if="!buttonLockControll">
            <div class="ui button" @click="profileModalSwitch"><i class="user circle icon"></i>
                <div class="username"><h5>{{userData.name}}</h5></div></div>
            <div class="ui floating dropdown icon button"  @click="toggleDropdown">
                <i class="dropdown icon"></i>
                <div  class="menu" :class="{ active: isDropdownOpen }" >
                   <button class="ui orange button" @click="logOut"><i class="sign-out alternate icon"></i> Log out</button>
                </div>
            </div>
        </div>
        <Profile v-if="show_Profile_Modal === true"
        :userData="this.userData"
        @cancel-modal="profileModalSwitch"
        @save-profile="saveProfileData"
        :tryAgain="this.tryAgain"></Profile>
    </div>
    
</template>

<style scoped>
  @media only screen and (max-width: 1338px){
      .header-items{
        display: none;
      }
      .userControl{
        display: none;
      }
    .mobile-menu{
      width: fit-content;
      height: fit-content;
    }
    .mobile-menu .mainIcon{
      font-size: 25px;
      height: 40px;
      top: 7px;
      right: 10px;
      background: #3277cd;
      width: 40px;
      border-radius: 5px;
      cursor: pointer;
      color: white;
    }
    .mobile-menu .menu{
      position: absolute;
      background: #375352;
      padding: 25px;
      top: 60px;
      right: 0;
      margin-left: auto;
      margin-right: auto;
      border-radius: 10px;
      min-width: 200px;
      border: 1px solid #347978;
      box-shadow: 2px 2px 5px rgba(37, 35, 35, 0.53);
    }
    .mobile-menu .closeBtn{
      width: 100%;
      height: 25px;
      cursor: pointer;
    }
    .mobile-menu .closeBtn:hover{
      color: red;
    }
    .mobile-menu .closeBtn i.icon{
      float: right;
      margin: 0 !important;
    }
    .mobile-menu .menu li{
      list-style: none;
      padding: 8px;
      text-align: center;
      margin: 5px 0;
    }
    .mobile-menu .menu li:hover{
      cursor: pointer;
      color: rgb(2, 248, 240);
    }
    .mobile-menu .menu li:hover::after{
      content: "";
      width: 100%;
      background: rgb(2, 248, 240);
      height: 4px;
      display: block;
      position: absolute;
      bottom: 3px;
      left: 0;
      transform: translateX(0px) skewX(-45deg);
      animation: .3s menuHoverAnim;
    }
    .mobile-menu .menu ul{
      align-items: center;
    }
    .mobile-menu i{
      height: fit-content;
    }
  }
  @media only screen and (min-width: 1338px) {
    .mobile-menu{
      display: none;
    }
  }
    .header{
        display: flex;
        justify-content: space-between;
        background: #375352;
        color: white;
        border-bottom: 1px solid #0dae6a;
    }
    .logo{
        display: flex;
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
    }
    .header-items ul{
      display: flex;
      flex-direction: row;
      list-style: none;
      height: 100%;
    }
    .header-items ul li{
      margin:0 15px;
      padding:15px;
      transition: color .3s ease-in-out;
    }
    .header-items ul li:hover{
      cursor: pointer;
      color: rgb(2, 248, 240);
    }
  .header-items ul li:hover::after{
    content: "";
    width: 100%;
    background: rgb(2, 248, 240);
    height: 4px;
    display: block;
    position: absolute;
    bottom: 4px;
    left: 0;
    transform: translateX(0px) skewX(-45deg);
    animation: .3s menuHoverAnim;
  }
  @keyframes menuHoverAnim {
    0% {
      transform: translateX(-30%) skewX(-45deg);
      opacity: 0;
    }
    100% {
      transform: translateX(0) skewX(-45deg);
      opacity: 1;
    }
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

    .ui.buttons .button:first-child{
        max-width: 150px;
        
        display: inline-flex;
    }
    .username{
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .username h5{
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

  @keyframes dropUp{
    0%{
      transform: translateY(0);
    }
    100%{
      transform: translateY(-500%);

    }
  }
  @keyframes dropDown{
    0%{
      transform: translateY(-100%);
    }
    100%{
      transform: translateY(0);
    }
  }
  .mobileMenuTransition-enter-active{
    animation:dropDown .5s;
  }
  .mobileMenuTransition-leave-active{
    animation: dropUp .8s;
  }


</style>