<script>
import { store } from "../VuexStore";
import { toRaw} from "vue";
import ServiceClient from '../ServiceClient'
export default{
    data(){
        return{
            store,
            userRole:{},
            managerCard:false,
            temporaryCard:false,
            needToCheck:null,
        }
    },
    watch:{
        '$store.state.userRole'(newValue) {
            this.userRole = newValue;
            this.SetUserCard();
        },
        '$store.state.managerNotifications':{
            immediate:true,
            handler(newValue){
                this.needToCheck = newValue;
            }
        }
    },
   
    computed:{
        needToCheck(){
            const color = this.needToCheck ? 'big orange binoculars icon':'big green binoculars icon'
            return color
        }
    },
    methods:{
        SetUserCard(){
            if(store.state.userRole.length>0){
                if(store.state.userRole.filter(item=> item.role ==="Manager")){
                    this.temporaryCard = false
                    this.managerCard=true
                }else{
                    this.temporaryCard = true
                }
            }else{
                this.$router.push('/accessdenied');
            }
        },
        managerProjects(){
            this.$router.push("/manager-projects")
        },

        managerTasks(){
            this.$router.push("/manager-tasks")

        },
    },
    beforeRouteEnter (to, from, next) {
      const userRole = store.state.userRole
      if(userRole.length>0){
        const isManager= userRole.some(item=>item.role === "Manager");
        if(isManager === true){
          next()
        }else{
          next('/accessdenied')
        }
      }else{
        next('/accessdenied')
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
            <h3>Welcome to your dashboard, manager!</h3>
        </div>
        
        <div class="ui link cards">
            
            <div class="card" v-if="this.temporaryCard == false" @click="managerProjects">
                
                <div class="image">
                <div class="card-icon"><i class="big green binoculars icon"></i></div>
    
                <img src="../assets/HomeP_icons/my_projects.png">
                </div>
                <div class="content">
                    <div><h3>Projects</h3></div>
                
                </div>
            </div>
 
           
            <div class="card"  v-if="this.temporaryCard == false" @click="managerTasks">
                <div class="card-icon"><i :class="needToCheck"></i></div>

                <div class="image">
                <img src="../assets/HomeP_icons/tasks.png">
                </div>
                <div class="content">
                    <div><h3>Tasks</h3></div>
                   
                </div>
            </div>
            <div class="card temporary" v-if="this.temporaryCard == true">
                <div class="image">
                <img src="../assets/HomeP_icons/temporary_lock.jpg">
                </div>
                <div class="content">
                    <div><h3>STOP!</h3></div>
                   
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
       left: calc(180px - 22%);
       background-color: black;
       height: 35px;
       border-radius: 3px !important;
       margin:0 !important;
    }
    i.icon{
        margin:0 !important
    }
</style>