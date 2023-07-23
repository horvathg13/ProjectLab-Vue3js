<script>
import { store } from "../VuexStore";
import { toRaw} from "vue";
export default{
    name:"Home",

    data(){
        return{
            store,
            userRole:{},
            userCard:false,
            showCards:false,
            temporaryMessage:false,
        }
    },
    computed: {
        username() {
            console.log(toRaw(this.$store.state))
            return this.$store.state.userData.name;
        }
    },
    watch:{
        '$store.state.userRole'(newValue) {
            this.userRole = newValue;
            console.log( this.userRole, "hello from user watcher");
            this.SetUserCard();
        }
    },
   
    methods:{
        SetUserCard(){
            if(this.userRole.code !==404){
                this.userRole.forEach(item=> {if(item.role ==="Admin"){ this.userCard=true}else{this.showCards = true}})
            }else if(this.userRole.code==404){
                this.temporaryMessage = true
            }
            
        },
    },
    mounted(){
       
    }
}
</script>


<template>
    <div class="HP-main">
        <div class= "background home">
        </div>  
        <div class="content-container">
        <div class="HP-title">
            <h1>Welcome {{ username }}</h1>
            <h3 v-if="this.temporaryMessage == false">Let's work on something!</h3>
            <h3 v-if="this.temporaryMessage == true">Please contact the admin to give roles to you!</h3>
        </div>
        
        <div class="ui link cards">
            
            <div class="card" v-if="userCard == true">
                <div class="image">
                <img src="../assets/HomeP_icons/users.png">
                </div>
                <div class="content">
                    <div class="header"><a href="/users">Users</a></div>
                   
                </div>
            </div>
            <!--<div class="card">
                <div class="image">
                <img src="../assets/HomeP_icons/rolepermission.png">
                </div>
                <div class="content">
                    <div class="header"><a href="/rolepermission">Roles and Permissions</a></div>
                   
                </div>
            </div>-->
            <div class="card" v-if="showCards == true">
                <div class="image">
                <img src="../assets/HomeP_icons/request_v2.png">
                </div>
                <div class="content">
                    <div class="header"><a href="/notifications">Notifications</a></div>
                    
                </div>
            </div>
            <div class="card" v-if="showCards == true">
                <div class="image">
                <img src="../assets/HomeP_icons/my_projects.png">
                </div>
                <div class="content">
                    <div class="header"><a href="/projects">Projects</a></div>
                    
                </div>
            </div>
            <div class="card" v-if="showCards == true">
                <div class="image">
                <img src="../assets/HomeP_icons/tasks.png">
                </div>
                <div class="content">
                    <div class="header"><a href="/my-tasks">My tasks</a></div>
                   
                </div>
            </div>
            <div class="card" v-if="showCards == true">
                <div class="image">
                <img src="../assets/HomeP_icons/stat_v3.png">
                </div>
                <div class="content">
                    <div class="header">Statistics</div>
                    
                </div>
            </div>
        </div>
        </div>
    </div>
</template>