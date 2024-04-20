
<script>
  import CreateTaskModal from './Modals/CreateTaskModal.vue';
  import ServiceClient from '../ServiceClient';
  import Success_Popup from './Common/Success_Popup.vue';
  import ErrorPopup from './Common/ErrorPopup.vue';
  import TaskAttachModal from './Modals/TaskAttachModal.vue';
  import CircularMenu from './Common/CircularMenu.vue';
  import CommentModal from './Modals/CommentModal.vue'
  import Status from './Modals/Status.vue'
  import Filter from './Common/FilterButton.vue'
  import Sort from './Common/SortButton.vue'
  import Loader from './Common/Loading.vue'
  import {store} from "../VuexStore"
  import EventHandler from "@/components/Common/EventHandler/eventHandler.vue";

  export default {
    components: {
      EventHandler,
        CreateTaskModal,
        Success_Popup,
        ErrorPopup,
        TaskAttachModal,
        CircularMenu,
        CommentModal,
        Status,
        Filter,
        Sort,
        Loader
    },
    props:{
        
    },

    data() {
        return {
            show_Create_Task_Modal:false,
            show_popup:false,
            show_error_popup:false,
            show_Attach_Modal:false,
            p_id:"",
            task_name:"",
            task_id:"",
            deadline:"",
            description:"",
            t_priority:"",
            getusers:{},
            priorities:Array,
            taskData:Array,
            message:"",
            projectData:[],
            AttachTask:Array,
            assignEmployee:Array,
            RequestData:[],
            getActiveTaskEmployee:Array,
            show_Comment_Modal: false,
            taskDataTravel:Array,
            Editdata:{},
            EditMode:false,
            projectButtons:{},
            mergedButtons:[],
            unreadMessage:{},
            newMessage:false,
            statusDataTravel:{},
            showStatusModal:false,
            ActualTaskData:{},
            loader:false,
            managerRole:false,
            adminRole:false,
            participantRole:false,
            RemoveData:[],
            finalData:{},
            errorArray:[],
            readOnlyMode:false,
            setSortData:[],
            setFilterData:[],
            userRole:{},
            tryAgain:null,
            showButton:null,
            serverError:''
        }
    },
    watch: {
        '$store.state.unreadMessages'(newValue) {
            this.unreadMessage = newValue;
        }
    },
   
    methods:{
        cancelModal(){
            this.show_Create_Task_Modal = false
            this.show_Attach_Modal = false
            this.show_Comment_Modal = false
            this.Editdata={},
            this.EditMode = false
            this.projectButtons = {},
            this.mergedButtons=[],
            this.showStatusModal =false,
            this.assignEmployee=[],
            this.RequestData=[],
            this.RemoveData=[];
            this.readOnlyMode=false
        },

            getPriorities(){
              ServiceClient.getPriorities().then(priorities=>{
                this.priorities=priorities
              }).catch(error=>{
                if(error.response){
                  this.serverError=error
                  this.show_error_popup=true
                }
              })
            },
           
            getTasks(){
              this.loader=true;
              this.taskData=[];
              ServiceClient.getManagedTasks().then((tasks)=>{
                tasks.map((e)=>{
                  this.taskData.push(e)
                })
                this.showButton=true,
                this.loader=false;
              }).catch((error)=>{
                if(error.response){
                  this.serverError=error
                  this.show_error_popup=true
                  this.loader=false;
                }
              })
            },
            TaskDetails(readOnlydata){
                const{data,readOnlyMode}=readOnlydata
                this.Editdata = readOnlydata.data,
                this.readOnlyMode = readOnlydata.readOnlyMode,
                this.show_Create_Task_Modal =true
            },
            commentModalSwitch(task){
              const {data} = task;
              this.taskDataTravel = task.data
              console.log(task)
              ServiceClient.getActiveEmployees(this.taskDataTravel.task_id).then((participants)=>{
                this.getActiveTaskEmployee=participants
                this.show_Comment_Modal = true
              }).catch((error) => {
                this.serverError=error
                this.show_error_popup=true
              });
            },
            SendMessage(emitData){
              const{message} = emitData
              this.tryAgain=true
              ServiceClient.sendMessage(message,this.ActualTaskData.p_id,this.taskDataTravel.task_id).then(response=>{
                this.tryAgain=false
              }).catch(error=>{
                this.tryAgain=false
                this.serverError=error
                this.show_error_popup=true
              })
            },
            getButtons(task){
               this.ActualTaskData = task;
              ServiceClient.getButtons(this.ActualTaskData.p_id).then(buttons => {
                 this.projectButtons = {};
                 this.mergedButtons = [];

                  buttons.map((item)=>{
                    if(item.employee){
                      this.projectButtons.employee= item.employee
                    }
                    if(item.manager){
                      this.projectButtons.manager= item.manager
                    }
                    if(item.admin){
                      this.projectButtons.admin= item.admin
                    }
                  });
                       
                   if(this.projectButtons.employee && this.projectButtons.employee.length>0){
                        this.mergedButtons.push(this.projectButtons.employee[1])
                        this.mergedButtons.push(this.projectButtons.employee[4])
                    }

                   if(this.projectButtons.manager && this.projectButtons.manager.length>0){
                        this.mergedButtons.push(this.projectButtons.manager[3])
                    }

                   let foundMatch = false;
                    for (let item of this.unreadMessage.Task) {
                        const values = Object.values(item);
                        for (let i = 0; i < values.length - 1; i++) {
                            if (values[i] == task.task_id && values[i + 1] == this.ActualTaskData.p_id) {
                                this.newMessage = true;
                                foundMatch = true
                                break;
                            }else{
                                this.newMessage = false;
                            }
                            if(foundMatch == true){
                                break;
                            }
                        }
                        if(foundMatch == true){
                            break;
                        }
                    }
                }).catch((error) => {
                  if (error.response){
                    this.serverError=error
                    this.show_error_popup=true
                  }
               });
            },
            SwitchStatusModal(statusData){
              const{data}=statusData
              this.tryAgain=false
              ServiceClient.getStatus(this.ActualTaskData.p_id, statusData.data.task_id).then(statuses=>{
                this.statusDataTravel= statuses
                this.statusDataTravel.priority = this.priorities
                this.showStatusModal = true;
              }).catch(error=>{
                this.serverError=error
                this.show_error_popup=true
              })
            },
            SetStatus(set){
              const{data,priority}=set
              this.tryAgain=true
              if(data !== "" || priority !== "") {

                ServiceClient.setStatus(this.ActualTaskData.p_id, this.ActualTaskData.task_id, data, priority).then(() => {
                  this.getTasks();
                  this.show_popup = true;
                  setTimeout(() => {
                    this.show_popup = false
                    this.cancelModal()
                  }, 1500)
                }).catch(error => {
                  if (error.response) {
                    this.tryAgain = false
                    this.serverError = error
                    this.show_error_popup = true
                  }
                })
              }else{
                setTimeout(()=>{
                  this.tryAgain = false
                },1000)
                this.message = 'Operation Canceled.'
                this.show_error_popup = true
              }
            },
            rowBackground(task){
                let color = "";
                if(task.status=="Suspended"){
                    color="error"
                }else if(task.status=="Completed"){
                    color="warning"
                }else if(task.status=="Accepted"){
                    color="positive"
                }
                return color
            },
            getUnreadMessages(){
                this.unreadMessage = this.$store.state.unreadMessages
            },
            ShoudShowEnvelope(task){
                let foundMatch = false;
                if(this.unreadMessage && this.unreadMessage !== undefined){
                    for (let item of this.unreadMessage.Task) {
                        const values = Object.values(item);
                        for (let i = 0; i < values.length - 1; i++) {
                            if (values[i] == task.task_id && values[i + 1] == task.p_id) {
                                return foundMatch = true
                            
                            }else{
                                foundMatch = false;;
                            }
                        }
                    }
                }
            },
            AcceptAllTasks(){
                if(this.showButton===true){
                    Promise.all(
                        ServiceClient.acceptAllTask(),
                        ServiceClient.getManagerNotifications(),
                        this.getTasks()
                    )
                }
            },
            managerNotificationUpdate(){
                ServiceClient.getManagerNotifications();
            },
            closeErrorModal(){
              this.show_error_popup=false
              this.serverError=[]
              this.message=''
              this.errorArray=[]
            },
        },
        beforeRouteEnter (to, from, next) {
          const isAdmin = store.state.userRole.some(item => item.role === "Manager");
          if(isAdmin === true){
            next();
          }else{
            next('/accessdenied');
          }
        },
        beforeMount(){
            this.getUnreadMessages();
        },
        mounted(){
            this.getPriorities()
            this.getTasks()
        }
    }

</script>

<template>
    <div class="main-container">
    <div class="background component">
    </div>
    <EventHandler
        :error-popup="show_error_popup"
        :success-popup="show_popup"
        :errorarray="errorArray"
        :success-message="message"
        :error-message="message"
        :server-error="serverError"
        @close="closeErrorModal"
    />
    <Transition name="drop">
        <AreYouSureModal v-if="show_areyousure_popup==true"></AreYouSureModal>
    </Transition>
    
    <div class="content-container">
        
    
        <div class="centerd-component-container" >
            
            <div class="scrolling-table-container">
                <Loader v-if="loader==true"></Loader>
                <table class="ui selectable striped table" >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Project</th>
                            <th>Name</th>
                            <th>Deadline</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Employees</th>
                            <th></th>
                            
                            <th>
                            <button v-if="this.showButton===true" class="ui right floated small primary labeled icon button" @click="AcceptAllTasks"><i class="green check icon"></i>Accept All</button></th>
                            
                        </tr>
                    </thead>
                    <tbody>

                        <tr v-for="task in taskData" :key="task.task_id" :class="rowBackground(task)">
                            <td>{{ task.task_id }}</td>
                            <td :style="{overflow:'auto', textOverflow:'ellipsis'}">{{ task.p_name }}</td>
                            <td :style="{overflow:'auto', textOverflow:'ellipsis'}">{{task.task_name }}</td>
                            <td>{{task.deadline }}</td>
                            <td>{{task.status }}</td>
                            <td>{{ task.priority}}</td>
                            <td>{{ task.employees }}</td>
                            <td >
                                <i v-if="ShoudShowEnvelope(task)" class="red envelope icon"></i>
                            </td>
                            
                            
                            <td>
                                <CircularMenu
                                  :data="task"
                                  :buttons="this.mergedButtons"
                                  :newMessage="this.newMessage"
                                  @click="getButtons(task)"
                                  @Attach_Modal="this.Attach_Modal"
                                  @AttachMyself="this.AttachMyself"
                                  @edit="this.EditingModeSwitch"
                                  @CommentEmit="this.commentModalSwitch"
                                  @SwitchModal="SwitchStatusModal"
                                  @CompletedEmit="Completed"
                                  @TaskDetailsEmit="TaskDetails">
                                </CircularMenu>
                                
                            </td>
                        
                            
                            
                        
                        </tr>
                    </tbody>
                    <tfoot class="full-width" v-if="this.loader == false">
                        <tr>
                            <th></th>
                            <th></th>
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
            <CreateTaskModal v-if="show_Create_Task_Modal==true" 
            @cancel-modal="cancelModal"  
            @create-task="createTask" 
            :getusers="this.getusers" 
            :priorities="this.priorities"
            :projectData="this.projectData"
            :EditMode="this.EditMode"
            :EditData="this.Editdata"
            :readOnlyMode="this.readOnlyMode"></CreateTaskModal>
    </Transition> 
    <Transition>
            <TaskAttachModal v-if="show_Attach_Modal == true"
            @cancel-modal="cancelModal"
            :getProjectParticipants="this.getusers"
            :getActiveTaskParticipants="this.getActiveTaskEmployee"
            :taskData="this.AttachTask"
            @attach-user="AssignEmployeeToTask"
            ></TaskAttachModal>
    </Transition>
    <CommentModal v-if="this.show_Comment_Modal == true"
    @cancel-modal="cancelModal"
    @sendEmit="SendMessage"
    :projectData="this.ActualTaskData"
    :taskData="this.ActualTaskData"
    :Participants="this.getActiveTaskEmployee"
    :projectId ="this.ActualTaskData.p_id"
    :tryAgain="this.tryAgain"
    ></CommentModal>
    <Status v-if="this.showStatusModal == true"
    @cancel-modal="cancelModal"
    :data="this.statusDataTravel"
    :task="true"
    @set-status="SetStatus"></Status>
</div>
</template>

<style scoped>

    
  
</style>