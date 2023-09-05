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
        <div class="ui large breadcrumb" v-for="(data,index) in meta" :key="index">
            <a class="section" :href="data.path">{{data.breadcrumb}}</a>
            <i class="right chevron icon divider"></i>
        </div>
       <div class="ui large breadcrumb section" v-if="h1Title !== 'Greeting' && h1Title !=='Register' && h1Title !=='Login' && h1Title !=='Homepage' " :class="{active: h1Title}"> {{ h1Title }}</div>
        <div class="notifications-container">
            <div class="message-container" v-if="(h1Title !== 'Greeting' && h1Title !=='Register' && h1Title !=='Login' && h1Title !== 'Reset Password' && this.computedLock==false)" >
                <div class="ui large red left pointing label" @click="redirectToNotifications"> 
                    <i class="bullhorn icon" v-if="systemNotification"></i>
                    <i class="bullhorn open icon" v-else></i>{{ message ? message: 0 }}
                </div>
            </div>
            <div class="message-container manager" v-if="(h1Title !== 'Greeting' && h1Title !=='Register' && h1Title !=='Login' && h1Title !== 'Reset Password' && this.computedLock==false && this.managerMode === true)" >
                <div class="ui large red label" @click="redirectToManagerNotifications"> 
                    <i class="binoculars icon" v-if="managerNotification"></i>{{ manager ? manager: 0 }}
                </div>
            </div>
        </div>

       
    </div>
</template>

<style scoped>
    .ui.label{
        width: max-content;
        z-index: 99;
        cursor: pointer;
        top:30px;
        
        
    }
    .message-container{
        margin-right: 5px;
    }
    /*.message-container.manager{
        left:42%;
    }*/
    .notifications-container{
        display: inline-flex;
        left:43%;
        justify-content:space-between;
    }
    .content-title-container{
        width: 100%;
        z-index: 999;
        
        display: flex;
        background-color: #00000019;
    }
    .message-container a {
        opacity: unset;
    }
    .message-container:hover{
        opacity: .8;
    }
    .message-container:hover {
        animation: shake 0.4s;
        animation-iteration-count: 1;
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
    color:black;
}
.ui.large.breadcrumb{
    color: lawngreen;
    font-weight: bold;
}

</style>