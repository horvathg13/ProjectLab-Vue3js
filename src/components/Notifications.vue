<script>
  import {store} from "../VuexStore";
  import Success from './Common/Success_Popup.vue';
  import ServiceClient from '../ServiceClient';
export default{
    props:{

    },
    components:{
        Success,
    },
    data(){
        return{
            notifications:{},
            message:"",
            showErrorPopup:false,
            unreadMessage:{}
        }
    },
    watch: {
        '$store.state.notifications'(newValue) {
            this.notifications = newValue
        },
        '$store.state.unreadMessages'(newValue) {
          this.unreadMessage = newValue
        },
        
    },
    computed:{

        
    },
    methods:{
        getUnreadMessages(){
          if(Object.keys(store.state.unreadMessages).length){
            this.unreadMessage = this.$store.state.unreadMessages
          }else{
            ServiceClient.getUnreadMessages().then((unreadMessages)=>{
              this.unreadMessage=unreadMessages
            });
          }
        },
        getNotifications(){
          if(store.state.notifications !==0){
            this.notifications = this.$store.state.notifications
          }else{
            ServiceClient.getNotifications().then((data)=>{
              this.notifications=data
            })
          }
        },
        ShoudShowEnvelope(n){
          console.log(this.unreadMessage);
            let foundMatch=false
            if(this.unreadMessage.Project !== undefined && n.type == 'Project'){
                for (let item of this.unreadMessage.Project) {
                    for(let i in Object.values(item)){
                        if(Object.values(item)[i] == n.id){
                            
                            foundMatch=true
                            return foundMatch;
                        }else{
                            foundMatch=false
                        }
                        if(foundMatch==true){
                            break;
                        }
                    }
                    if(foundMatch==true){
                        break;
                    }
                }
            }
            if(this.unreadMessage && this.unreadMessage.Task !== undefined && n.type == 'Task'){
                for (let item of this.unreadMessage.Task) {
                    const values = Object.values(item);
                    for (let i = 0; i < values.length - 1; i++) {
                        if (values[i] == n.id) {
                            return foundMatch = true
                        }else{
                            foundMatch = false;;
                        }
                    }
                }
            }        
        },
    },
    beforeRouteEnter(to, from, next) {
        if(store.state.userRole.length ===0){
          ServiceClient.getUserRoles().then(roles=>{
            if (roles.length!==0){
              next()
            }else{
              next('/accessdenied')
            }
          }).catch(error=>{
            console.log(error)
            next('/accessdenied')
          })
        }else{
          next();
        }
    },
    beforeMount() {

    },
    mounted(){
      this.getUnreadMessages();
      this.getNotifications();

    },
}
</script>

<template>
    <div class="main-container">
        <div class="background component">
        </div>
        <div class="content-container"> 

            <div class="centerd-component-container">
                
                <div class="scrolling-table-container">
                    <table class="ui selectable striped table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Deadline</th>
                                <th></th>
                                <!--<th>Days left</th>-->
                            </tr>
                        </thead>
                        
                        <tbody>
                            <tr v-for="n in notifications" :key="n.id" class="warning">
                                <td>{{n.id}}</td>
                                <td>{{n.type}}</td>
                                <td :style="{overflow:'auto', textOverflow:'ellipsis'}">{{n.title}}</td>
                                <td>{{n.status}}</td>
                                <td>{{n.deadline}}</td>
                                <td ><i v-if="ShoudShowEnvelope(n)" class="red envelope icon"></i></td>
                            </tr>
                        </tbody>
                        <tfoot class="full-width">
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th colspan="4">
                            
                                </th>
                            </tr>
                            
                        </tfoot>
                    </table>
            </div>
            </div>
        </div>
        <Transition>
                
        </Transition>
        
    </div>

</template>

<style scoped>

</style>
