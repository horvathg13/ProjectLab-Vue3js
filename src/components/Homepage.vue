<script>
import { store } from "../VuexStore";
import { toRaw} from "vue";
export default{
    name:"Home",

    data(){
        return{
            store,
            
        }
    },
    computed: {
        username() {
            console.log(toRaw(this.$store.state))
            return this.$store.state.userData.name;
        }
    },
}
</script>


<template>
    <div class="HP-main">
        <div class= "background home">
        </div>  
        <div class="content-container">
        <div class="HP-title">
            <h1>Welcome {{ username }}</h1>
            <h3>Let's work on something!</h3>
        </div>
        
        <div class="ui link cards">
            
            <div class="card">
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
            <div class="card">
                <div class="image">
                <img src="../assets/HomeP_icons/request_v2.png">
                </div>
                <div class="content">
                    <div class="header">Notifications</div>
                    
                </div>
            </div>
            <div class="card">
                <div class="image">
                <img src="../assets/HomeP_icons/my_projects.png">
                </div>
                <div class="content">
                    <div class="header"><a href="/projects">Projects</a></div>
                    
                </div>
            </div>
            <div class="card">
                <div class="image">
                <img src="../assets/HomeP_icons/tasks.png">
                </div>
                <div class="content">
                    <div class="header"><a href="/my-tasks">My tasks</a></div>
                   
                </div>
            </div>
            <div class="card">
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