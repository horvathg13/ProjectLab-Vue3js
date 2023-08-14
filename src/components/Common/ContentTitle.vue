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
            console.log(newValue.length,"kakakaokspd")
            this.message = newValue.length;
            console.log(newValue.length, "hello notifica watch");
        },
        '$store.state.userRole'(newValue) {
            this.userRole = newValue;
            console.log( this.userRole, "hello from user watcher");
            this.lock();
        },
        '$store.state.managerNotifications'(newValue) {
            console.log(newValue,"kakakaokspd")
            this.manager = newValue;
            console.log(newValue, "hello ManagerNotifica watch");
        },
    },
    computed: {
        breadcrumbs() {
            return Array.isArray(this.meta) ? this.meta : [this.meta];
            
        },
        
        
    }, 
    methods:{
        lock(){
            if(this.userRole.code ?? this.userRole.code == 404){
                this.lockMode = true
                    
            }else{
                this.lockMode = false
            }   
        },
        
    },
   
    beforeMount() {
        this.lock();
        
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
       <div class="ui large breadcrumb section" v-if="h1Title != 'Greeting' && h1Title !=='Register' && h1Title !=='Login' && h1Title !=='Homepage'" :class="{active: h1Title}"> {{ h1Title }}</div>
        <div class="message-container" v-if="h1Title !== 'Greeting' && h1Title !=='Register' && h1Title !=='Login' && this.lockMode==false">
            <div class="ui large red left pointing label"><a href="/notifications">
                <i class="bullhorn icon" v-if="message !== 0 && message !== null"></i>
                <i class="bullhorn open icon" v-else></i>{{ message ? message: 0 }}</a>
            </div>
             
        </div>
        <div class="message-container manager" v-if="h1Title !== 'Greeting' && h1Title !=='Register' && h1Title !=='Login' && this.lockMode==false">
            <div class="ui large red label"><a href="/manager-tasks">
                <i class="binoculars icon" v-if="message !== 0 && message !== null"></i>{{ manager ? manager: 0 }}</a>
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
        left:calc(100% - 50%);
    }
    .message-container.manager{
        left:calc(100% - 48%);
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