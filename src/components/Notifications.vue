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
        
    },
    computed:{

        
    },
    methods:{
        getUnreadMessages(){
            this.unreadMessage = this.$store.state.unreadMessages
        },
        getNotifications(){
            this.notifications = this.$store.state.notifications
        },
        ShoudShowEnvelope(n){
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
        ServiceClient.post('/api/getUserRole').then(response => {
            if(response.status === 200){
                store.commit("setuserRole",response.data)
                const userRole = response.data
                if(userRole.code === 404){
                    
                    next('/accessdenied')
                  
                }else{
                    next();
                }
            }
            
        }).catch(error =>{
            console.log(error);
        });
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
