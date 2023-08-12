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
            managerCard:false,
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
                this.userRole.forEach(item=> {if(item.role ==="Manager"){this.temporaryCard = false, this.managerCard=true} else{this.temporaryCard = true}})
            }else if(this.userRole.code==404){
                this.$router.push('/accessdenied');
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
        managerProjects(){
            this.$router.push("/manager-projects")
        },

        managerTasks(){
            this.$router.push("/manager-tasks")

        }

    },
    beforeMount() {
       
    },
    mounted(){
        this.getUserRoles();
       
    }
}
</script>


<template>
    <div class="HP-main">
        <div class= "background home">
        </div>  
        <div class="content-container">
        <div class="HP-title">
            <h1>Welcome on the board, manager!</h1>
        </div>
        
        <div class="ui link cards">
            
            <div class="card" v-if="this.temporaryCard == false" @click="managerProjects">
                <div class="image">
                <img src="../assets/ManagerDashboard/manager_projects_v6.png">
                </div>
                <div class="content">
                    <div class="header">Projects</div>
                   
                </div>
            </div>
           
            <div class="card"  v-if="this.temporaryCard == false" @click="managerTasks">
                <div class="image">
                <img src="../assets/ManagerDashboard/manager_tasks_v2.png">
                </div>
                <div class="content">
                    <div class="header">Tasks</div>
                   
                </div>
            </div>
            <div class="card temporary" v-if="this.temporaryCard == true">
                <div class="image">
                <img src="../assets/HomeP_icons/temporary_lock.jpg">
                </div>
                <div class="content">
                    <div class="header">STOP!</div>
                   
                </div>
            </div>
            
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
</style>