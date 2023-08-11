<script>
  import {store} from "../VuexStore";
  import Error from './Common/ErrorPopup.vue';
  import ServiceClient from '../ServiceClient';
export default{
    props:{

    },
    components:{
        Error,
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
            console.log(newValue.length, "hello notifica watch");
        },
        notifications(newValue){
            if(newValue.length == 0){
                console.log("enter the hook")
                this.message = "You have no system notification!"
                this.showErrorPopup = true
                setTimeout(() => {
                    this.showErrorPopup = false
                    this.message = "";
                },2000)
            }
            
       
            
        },
        
    },
    computed:{

        
    },
    methods:{
        getUnreadMessages(){
            ServiceClient.post('/api/get-unread-messages').then(response => {
                console.log("getUnreadMessages",response.data);
                store.commit("getUnreadMessages", response.data);
                this.unreadMessage = response.data
            }).catch(error =>{
                console.log(error);
            });
        },
        getNotifications(){
            ServiceClient.post('/api/notifications').then(response => {
                store.commit("getNotifications",response.data);
                console.log(response.data, "notifica");
            }).catch(error =>{
                console.log(error);
            });
        },
        ShoudShowEnvelope(n){
            let foundMatch=false
            if(this.unreadMessage.Project !== undefined && n.type == 'Project'){
                for (let item of this.unreadMessage.Project) {
                    //console.log(Object.values(item), "unreadPro");
                    for(let i in Object.values(item)){
                        if(Object.values(item)[i] == n.id){
                            
                            foundMatch=true
                            console.log("match");
                            return foundMatch;
                        }else{
                            foundMatch=false
                            console.log("match");
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
                    //console.log(Object.values(item), "unreadPro");
                    const values = Object.values(item);
                    for (let i = 0; i < values.length - 1; i++) {
                        //console.log(values[i], "unreadPro")
                        if (values[i] == n.id) {
                            return foundMatch = true
                        
                        }else{
                            foundMatch = false;;
                            console.log("match");
                        }
                        
                    }
                
                
                }
            }        
                    
                
                
        },

    },
    beforeMount() {
       
    },
    mounted(){
        this.getNotifications();
        this.getUnreadMessages();
    },
}
</script>

<template>
    <div class="main-container">
        <div class="background component">
        </div>
        <Transition name="drop">
            <Error v-if="showErrorPopup == true" :message="this.message"></Error>
        </Transition>
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
                                <td>{{n.title}}</td>
                                <td>{{n.status}}</td>
                                <td>{{n.deadline}}</td>
                                <td ><i v-if="ShoudShowEnvelope(n)" class="red envelope icon"></i></td>

                                <!--<td>{{ n.days }} </td>-->     
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
 .ui.segment{
        position: absolute;
        width:100%;
        height: 100px !important;
       
    }
</style>
