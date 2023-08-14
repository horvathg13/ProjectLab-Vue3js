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
            needToCheck:null,
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
            
            
        },
        '$store.state.managerNotifications'(newValue) {
            this.needToCheck = newValue;
            
        }
    },
   
    computed:{
        needToCheck(){
            if(this.needToCheck !== null || this.needToCheck !==0){
                return "big orange binoculars icon"
            }else{
                return "big green binoculars icon"
            }
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
                <div class="card-icon"><i class="big green binoculars icon"></i></div>
    
                <img src="../assets/HomeP_icons/my_projects.png">
                </div>
                <div class="content">
                    <div class="header">Projects</div>
                
                </div>
            </div>
 
           
            <div class="card"  v-if="this.temporaryCard == false" @click="managerTasks">
                <div class="card-icon"><i :class="needToCheck"></i></div>

                <div class="image">
                <img src="../assets/HomeP_icons/tasks.png">
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
    .card-icon{
       position: absolute;
       z-index: 9;
       left: calc(180px - 19.5%);
       background-color: black;
       height: 35px;
       border-radius: 3px !important;
       margin:0 !important;
    }
    i.icon{
        margin:0 !important
    }
</style>