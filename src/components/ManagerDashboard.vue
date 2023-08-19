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
            console.log(color)
            return color
            /*if(this.needToCheck !== null || this.needToCheck !==0){
                console.log(this.needToCheck,"CHECK")
                return "big orange binoculars icon"
            }else{
                return "big green binoculars icon"
            }*/
        }
    },
    methods:{
        SetUserCard(){
            if(this.userRole && this.userRole.code !==404){
                if(this.userRole.filter(item=> item.role ==="Manager")){
                    this.temporaryCard = false
                    this.managerCard=true
                }else{
                    this.temporaryCard = true
                }
            }else if(this.userRole.code==404){
                this.$router.push('/accessdenied');
            }
            
        },
        managerProjects(){
            this.$router.push("/manager-projects")
        },

        managerTasks(){
            this.$router.push("/manager-tasks")

        },
        /*getManagerNotifications(){

            ServiceClient.post('/api/get-manager-notification').then(response => {
                store.commit("getManagerNotifications",response.data);
                console.log(response.data, "ManagerNotifica");
            }).catch(error =>{
                console.log(error);
            });
        }*/

    },
    beforeRouteEnter (to, from, next) {
        ServiceClient.post('/api/getUserRole').then(response => {
            if(response.status === 200){
                store.commit("setuserRole",response.data)
                const userRole = response.data
                //console.log(response.data, "getUserRole");
                if(userRole.code !== 404){
                    //console.log(this.userRole);
                    const isAdmin= userRole.some(item=>item.role === "Admin" || item.role === "Manager");
                    //console.log(isAdmin,"AMIN")
                    if(isAdmin === false){
                        next('/accessdenied')
                    }else{
                        next();
                    }
                }else{
                    next('/accessdenied')
                }
            }
            
        }).catch(error =>{
            console.log(error);
        });
    },
    /*beforeMount() {
       this.getManagerNotifications();
    },*/
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