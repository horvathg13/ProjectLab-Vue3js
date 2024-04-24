<script>
import ServiceClient from '../../ServiceClient';
import {store} from "../../VuexStore"
export default{
    
    props:{
        h1Title:"",
        route:"",
        meta:[]
    },
    data(){
        return{
            message:null,
            userRole:{},
            lockMode:false,
            manager:null,
        }
    },
    watch:{
        '$store.state.notifications'(newValue) {
            this.message = newValue.length;
        },
        '$store.state.userRole'(newValue){
            this.userRole = newValue;
        },
        '$store.state.managerNotifications'(newValue) {
            this.manager = newValue;
        },
    },
    computed: {
        breadcrumbs() {
            return Array.isArray(this.meta) ? this.meta : [this.meta];
        },
        computedLock(){
            const lock = this.userRole.code ? this.userRole.code === 404:false
            return lock
        },
        managerMode(){
            const managerRoles = Object.values(this.userRole);
            const findManager = managerRoles.some((role)=>role.role==='Manager')
            return findManager
        },
        systemNotification(){
            const notification = this.$store.state.notifications
            this.message = notification ? notification.length:0
            return this.message
        },
        managerNotification(){
            const notification = this.$store.state.managerNotifications
            this.manager = notification ? notification:0
            return this.manager
        }
        
    },
    methods:{
        redirectToNotifications(){
            this.$router.push('/notifications')
        },
        redirectToManagerNotifications(){
            this.$router.push('/manager-notifications')
        }
        
    },
   
    beforeMount() {
        
    },
    mounted() {
    },
 
}
</script>

<template>
    <div class="content-title-container">
        <div class="content-title" v-if="h1Title !== 'Users'">
            <h1>{{h1Title}}</h1>
        </div>
        <div class="content-title users" v-if="h1Title == 'Users'">
            <h1>{{h1Title}}</h1>
        </div>
        <div class="breadcrumb-container">
          <div class="ui large breadcrumb" v-for="(data,index) in meta" :key="index">
              <RouterLink class="section" :to="data.path">{{data.breadcrumb}}</RouterLink>
              <i class="right chevron icon divider"></i>
          </div>
       <div class="ui large breadcrumb section" v-if="h1Title !== 'Greeting' && h1Title !=='Register' && h1Title !=='Login' && h1Title !=='Homepage' " :class="{active: h1Title}"> {{ h1Title }}</div>
      </div>
      <div class="notifications-container">
            <div class="message-container" title="Notifications" v-if="(h1Title !== 'Greeting' && h1Title !=='Register' && h1Title !=='Login' && h1Title !== 'Reset Password' && this.computedLock==false)" >
                <div class="ui large red left pointing label" @click="redirectToNotifications">
                    <i class="bullhorn icon" v-if="systemNotification"></i>
                    <i class="bullhorn open icon" v-else></i>{{ message ? message: 0 }}
                </div>
            </div>
            <div class="message-container manager" v-if="(h1Title !== 'Greeting' && h1Title !=='Register' && h1Title !=='Login' && h1Title !== 'Reset Password' && this.computedLock==false && this.managerMode === true)" >
                <div class="ui large red label"  title="Manager Notification" @click="redirectToManagerNotifications">
                    <i class="binoculars icon"  v-if="managerNotification"></i>{{ manager ? manager: 0 }}
                </div>
            </div>
        </div>

       
    </div>
</template>

<style scoped>
    .breadcrumb-container{
      width: 400px;
      min-width: 190px;
    }
    .ui.label{
        width: max-content;
        z-index: 99;
        cursor: pointer;
        top:25px;
    }
    .message-container{
        margin-right: 5px;
    }
    /*.message-container.manager{
        left:42%;
    }*/
    .notifications-container{
        display: flex;
        width: 400px;
        min-width: 100px;
    }
    @media screen and (max-width:800px ){
      .notifications-container{
        //display: grid;
        height: 35px;
        width: 50%;
        flex-flow: row-reverse;
        display: inline-flex;
      }
      .ui.label{
        top: 5px;
      }
      .breadcrumb-container{
        //display: grid;
        width: 50%;
        text-align: center;
        display: inline-block;
        height: 35px;
        margin: 10px;
      }
      .ui.large.breadcrumb{
        height: 25px !important;
        top: 5px !important;
      }
      .breadcrumb-container{
        width: fit-content;
      }
      .content-title-container{
        display: block !important;
      }
    ;
    }
    .content-title-container{
        width: 100%;
        z-index: 999;
        display: flex;
        justify-content: space-around;
        background-color: #00000019;
    }
    .content-title{
      width: 400px;
      min-width: 200px;
    }
    .message-container a {
        opacity: unset;
    }

    .ui.label:hover{
      opacity: .9;
    }

@keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    60% { transform: translate(-2px, 1px) rotate(0deg); }
    70% { transform: translate(1px, 1px) rotate(-1deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.ui.large.breadcrumb{
    max-width: max-content;
    height: 50px;
    left:calc(100% - 80%);
    top:35px;
}
.ui.breadcrumb a.section{
    color:white;
}
.ui.breadcrumb .icon.divider{
    color:white;
}
.ui.large.breadcrumb{
    color: lawngreen;
    font-weight: bold;
}


</style>