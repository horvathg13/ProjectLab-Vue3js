<script>
    import ServiceClient from '../ServiceClient';
    import Success_Popup from './Common/Success_Popup.vue';
    import ErrorPopup from './Common/ErrorPopup.vue';
import router from '../router';
    
export default{
    data(){
        return{
            loader:false,
            myTasks:Array,
            message:"",
            show_error_popup:false
        }
    },
    components:{
        Success_Popup,
        ErrorPopup,
      
    },
    methods:{
        getMyTasks(){
            //this.loader=true;
            let url ="http://127.0.0.1:8000/api/get-my-tasks";
            ServiceClient.post(url).then((response) =>{
                    
                if (response.status == 200){
                    
                    this.myTasks=response.data
                    console.log(this.myTasks ,"MYTASK")
                    this.loader=false;
                }
            }).catch((error) => {
                    
                if (error.response && error.response.status) {
                    if (error.response.data && error.response.data.message) {
                        this.message= error.response.data.message
                        this.show_error_popup = true
                        this.loader=false;
                        setTimeout(() => {
                            this.show_error_popup = false
                            this.message = "";
                        },  4500)
                        
                    }
                }
            });
        },
        rowBackground(task){
            let color = "";
            if(task.status=="Urgent"){
                color="warning"
            }else if(task.status=="Suspended"){
                color="error"
            }else if(task.status=="Completed"){
                color="warning"
            }else if(task.status=="Accepted"){
                color="positive"
            }
            return color
        },
        jump(task){
            router.push(`/projects/${task.projectId}/tasks`)
        }
    },
    mounted(){
        this.getMyTasks();
    },
}
</script>


<template>
        <div class="main-container">
        <div class="background component">
        </div>
        
        <!--<Transition name="drop">
            <Success_Popup v-if="show_popup==true" :message="this.message"></Success_Popup>
        </Transition>-->
        <Transition name="drop">
            <ErrorPopup v-if="show_error_popup==true" :message="this.message"></ErrorPopup>
        </Transition>
       
        <div class="content-container"> 
            
            <div class="centerd-component-container">
                
                <div class="scrolling-table-container">
                    <table class="ui selectable striped table">
                        <thead>
                            <tr>
                                <th>TaskID</th>
                                <th>Project</th>
                                <th>Task name</th>
                                <th>Status </th>
                                <th>Priority</th>
                                <th>Deadline</th>
                                <th></th>
                               
                            </tr>
                        </thead>
                        <tbody v-if="loader==true">
                            <div class="ui segment" >
                                <div class="ui active dimmer">
                                    <div class="ui small text loader">Loading</div>
                                </div>
                                <p></p>
                            </div>
                        </tbody>
                        <tbody v-if="loader==false">
                            <tr v-for="task in myTasks" :key="task.id" :class="rowBackground(task)">
                                <td>{{task.id}}</td>
                                <td>{{task.projectName}}</td>
                                <td>{{task.name}}</td>
                                <td>{{ task.status}}</td>
                                <td>{{ task.priority}}</td>
                                <td>{{ task.deadline}}</td>
                                <td>
                                   <i class="arrow large alternate circle right icon" @click="jump(task)"></i>
                                    <!--<CircularMenu
                                        @click="getButtons(task)"
                                        :data="project"
                                        :buttons="this.mergedButtons"
                                        :component="this.$route.name"
                                        :newMessage="this.newMessage"
                                        @redirect="this.redirect"
                                        @showParticipantModal="this.showParticipantModal"
                                        @edit="this.EditingModeSwitch"
                                        @CommentEmit="this.commentModalSwitch"
                                        @SwitchModal="SwitchStatusModal">
                                    </CircularMenu>*/-->
                                </td>
                            
                                
                                
                            
                            </tr>
                        </tbody>
                        <tfoot class="full-width" v-if="loader==false">
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
        
        
    </div>
</template>



<style scoped>
 .ui.segment{
        position: absolute;
        width:100%;
        height: 100px !important;
       
    }

    i.icon{
        cursor: pointer;
        transition: all .2s ease-in-out; 
    }
    i.icon:hover{
        transform: scale(1.4); 
    }
</style>