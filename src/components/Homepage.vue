<script>
import { store } from "../VuexStore";
import { toRaw} from "vue";
import ServiceClient from '../ServiceClient'
export default{
    name:"Home",

    data(){
        return{
            store,
            userRole:{},
            userCard:false,
            showCards:false,
            managerCard:false,
            temporaryMessage:false,
            temporaryCard:false,
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
            if(this.userRole && this.userRole.code !==404){
                this.userRole.forEach(item=> {if(item.role ==="Admin"){ this.userCard=true}else if(item.role ==="Manager"){this.managerCard=true}else{this.showCards = true}})
            }else if(this.userRole.code==404){
                this.temporaryMessage = true
                this.temporaryCard=true
            }
            
        },
        getUserRoles(){
            ServiceClient.post('/api/getUserRole').then(response => {
                store.commit("setuserRole",response.data)
                console.log(response.data, "getUserRole");
            }).catch(error =>{
            console.log(error);
            });
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

    },
    beforeMount() {
        this.getUserRoles();
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
            <div class="card temporary" v-if="temporaryCard == true">
                <div class="image">
                <img src="../assets/HomeP_icons/temporary_lock.jpg">
                </div>
                <div class="content">
                    <div class="header">STOP!</div>
                   
                </div>
            </div>
            <div class="card" v-if="userCard == true" @click="users">
                <div class="image">
                <img src="../assets/HomeP_icons/users.png">
                </div>
                <div class="content">
                    <div class="header">Users</div>
                   
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
            <div class="card" v-if="showCards == true" @click="notifications">
                <div class="image">
                <img src="../assets/HomeP_icons/request_v2.png">
                </div>
                <div class="content">
                    <div class="header">Notifications</div>
                    
                </div>
            </div>
            <div class="card" v-if="showCards == true" @click="projects">
                <div class="image">
                <img src="../assets/HomeP_icons/my_projects.png">
                </div>
                <div class="content">
                    <div class="header">Projects</div>
                    
                </div>
            </div>
            <div class="card" v-if="showCards == true" @click="fprojects">
                <div class="image">
                <img src="../assets/HomeP_icons/favorite-book.png">
                </div>
                <div class="content">
                    <div class="header">Favorite Projects</div>
                    
                </div>
            </div>
            <div class="card" v-if="showCards == true" @click="mytasks">
                <div class="image">
                <img src="../assets/HomeP_icons/tasks.png">
                </div>
                <div class="content">
                    <div class="header">My tasks</div>
                   
                </div>
            </div>
            <div class="card" v-if="managerCard == true" @click="managerDb">
                <div class="image">
                <img src="../assets/HomeP_icons/manager.png">
                </div>
                <div class="content">
                    <div class="header">Manager Dashboard</div>
                   
                </div>
            </div>
            <!--<div class="card" v-if="showCards == true">
                <div class="image">
                <img src="../assets/HomeP_icons/stat_v3.png">
                </div>
                <div class="content">
                    <div class="header">Statistics</div>
                    
                </div>
            </div>-->
        </div>
        </div>
    </div>
</template>

<style scoped>
    .ui.link.cards > .card.temporary{
        width: auto;
        height: auto;
        cursor: not-allowed;
    }
    .HP-title{
        text-align: center;
        width: auto;
        max-width: 800px;
    }
    .HP-title h1{
        overflow: hidden;
        text-overflow: ellipsis;

    }
</style>