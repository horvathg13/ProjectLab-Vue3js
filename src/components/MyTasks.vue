<script>
    import ServiceClient from '../ServiceClient';
    import Success_Popup from './Common/Success_Popup.vue';
    import ErrorPopup from './Common/ErrorPopup.vue';
    import CreateTaskModal from './Modals/CreateTaskModal.vue';
    import TaskAttachModal from './Modals/TaskAttachModal.vue';
    import CircularMenu from './Common/CircularMenu.vue';
    import CommentModal from './Modals/CommentModal.vue'
    import Status from './Modals/Status.vue'
    import Sort from './Common/SortButton.vue'
    import {store} from '../VuexStore'
    import Loader from './Common/Loading.vue'
    import EventHandler from "@/components/Common/EventHandler/eventHandler.vue";
    import * as Promis from "axios";
    
export default{
    data(){
        return{
            loader:false,
            myTasks:Array,
            message:"",
            show_error_popup:false,
            AttachTask:[],
            getActiveTaskEmployee:[],
            show_Create_Task_Modal:false,
            show_popup:false,
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
            projectData:[],
            assignEmployee:Array,
            RequestData:[],
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
            RemoveData:[],
            setSortData:[],
            readOnlyMode:false,
            tryAgain:null,
            serverError:'',
            ActualTaskProjectData:{}
        }
    },
    components:{
      EventHandler,
        Success_Popup,
        ErrorPopup,
        CreateTaskModal,
        TaskAttachModal,
        CircularMenu,
        CommentModal,
        Status,
        Sort,
        Loader,
    },
    watch: {
        '$store.state.unreadMessages'(newValue) {
            this.unreadMessage = newValue;
        }
    },
    methods:{
        getMyTasks(){
          this.loader=true
          ServiceClient.getMyTasks(this.setSortData).then(tasks=>{
            this.myTasks=tasks
            this.loader=false;
          }).catch((error)=>{
            if(error.response){
              this.loader=false
            }
          })
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
       
        Attach_Modal(task){
            this.getProjectParticipants().then(()=>{
              const{data} = task
              this.AttachTask = task.data.taskData
              ServiceClient.getActiveEmployees(this.AttachTask.id).then((employees)=>{
                this.getActiveTaskEmployee = employees
                let newUsers=this.getusers.filter((e)=> {
                  return !this.getActiveTaskEmployee.some(participant => participant.id === e.userId);
                });
                this.getusers=newUsers
                this.show_Attach_Modal = true
              }).catch((error) => {
                this.serverError=error
                this.show_error_popup=true
              })
            })
        },

        cancelModal(){
            this.show_Create_Task_Modal=false,
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
        },

        createTask(data){
          this.closeErrorModal()
          this.tryAgain=true;
          const { task } = data
          ServiceClient.createTask(this.ActualTaskProjectData.project_id, task.name, task.deadline, task.description, task.priority, task.id).then((success)=>{
            this.show_popup = true
            setTimeout(() => {
              this.show_popup = false
              this.getMyTasks();
              this.cancelModal();
              this.message=""
            },  1500)
          }).catch(error=>{
            if(error.response){
              this.tryAgain=false;
              this.serverError=error
              this.show_error_popup=true
            }
          })
        },
        AssignEmployeeToTask(data){
          this.closeErrorModal()
          this.tryAgain=true
          const {selected_employee, remove_employee}=data

          if(data.selected_employee.select !== undefined){
            this.assignEmployee=data.selected_employee.select;
            this.RequestData = this.assignEmployee.map(employee => {
              return {
                id: employee.id,
                name: employee.name,
                deadline: this.AttachTask.deadline,
                description: this.AttachTask.description,
                task_status: this.AttachTask.status,
                task_id: this.AttachTask.id,
                task_name: this.AttachTask.task_name
              };
            });
          }
          if(data.remove_employee !== null){
            this.RemoveData=data.remove_employee;
          }
          Promis.all([
          ServiceClient.assignEmployeeToTask(this.RequestData,this.RemoveData,this.AttachTask.id,this.ActualTaskProjectData.project_id).then((success)=>{
            this.show_popup = true
            setTimeout(() => {
              this.show_popup = false
              this.getMyTasks()
              this.message=""
            },  1500)
          }).catch(error=>{
            if(error.response){
              this.tryAgain=false;
              this.RequestData=[];
              this.serverError=error
              this.show_error_popup=true
            }
          }),
          ServiceClient.getProjectParticipants(this.ActualTaskProjectData.project_id).then(participants=>{
            return this.getusers = participants
          }),
          ServiceClient.getActiveEmployees(this.AttachTask.id).then((employees)=>{
            this.getActiveTaskEmployee = employees
            let newUsers=this.getusers.filter((e)=> {
              return !this.getActiveTaskEmployee.some(participant => participant.id === e.userId);
            });
            this.getusers=newUsers
            this.show_Attach_Modal = true
          }).catch((error) => {
            this.serverError=error
            this.show_error_popup=true
          })
          ])
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

        getProjectParticipants(){
          return ServiceClient.getProjectParticipants(this.ActualTaskProjectData.project_id).then(participants=>{
             return this.getusers = participants
          }).catch((error) => {
            if (error.response.data && error.response.data.message) {
              this.message= error.response.data.message
              this.show_error_popup = true
            }
          });
        },
        
        EditingModeSwitch(task){
            const {data, switching} = task
            this.Editdata = task.data.taskData
            this.EditMode = task.switching;
            this.show_Create_Task_Modal =true
        },
        commentModalSwitch(task){
          this.taskDataTravel = task.data
          ServiceClient.getProjectParticipants(this.taskDataTravel.projectData.project_id).then((participants)=>{
            this.getActiveTaskEmployee=participants
            this.show_Comment_Modal = true
          }).catch((error) => {
            this.serverError=error
            this.show_error_popup=true
          });
        },
        SendMessage(emitData){
          this.closeErrorModal()
          const{message} = emitData
          this.tryAgain=true
          ServiceClient.sendMessage(message,this.taskDataTravel.projectData.project_id,this.taskDataTravel.taskData.id).then(response=>{
            this.tryAgain=false
          }).catch(error=>{
            if(error.response.data.message){
              this.tryAgain=false
              this.serverError=error
              this.show_error_popup=true
            }
          })
        },
        getButtons(task){
            this.ActualTaskData = task.taskData;
            this.ActualTaskProjectData=task.projectData;
          ServiceClient.getButtons(task.projectData.project_id).then(buttons=>{
            this.projectButtons = {};
            this.mergedButtons = [];

            buttons.map((item)=>{
              if(item.employee){
                this.projectButtons.employee= item.employee
              }
              if(item.manager){
                this.projectButtons.manager= item.manager
              }
            });

            if(this.projectButtons.employee && this.projectButtons.employee.length>0){
                for(let item in this.projectButtons.employee){
                    if(this.projectButtons.employee[item].label === 'Completed' && this.ActualTaskData.status === 'Completed'){
                        let findButton =this.projectButtons.employee.indexOf(this.projectButtons.employee[item]);
                        this.projectButtons.employee.splice(findButton,1)
                    }
                }
                this.mergedButtons.push(this.projectButtons.employee[1])
                this.mergedButtons.push(this.projectButtons.employee[3])
                this.mergedButtons.push(this.projectButtons.employee[4])
            }

            if(this.projectButtons.manager && this.projectButtons.manager.length>0){
                this.projectButtons.manager = this.projectButtons.manager.slice(1)
                for(let item in this.projectButtons.manager){
                    this.mergedButtons.push(this.projectButtons.manager[item])
                }
            }

            for (let item in this.unreadMessage.Task) {
                const keys = Object.keys(this.unreadMessage.Task[item]);

                if (
                    this.unreadMessage.Task[item][keys[0]] === task.task_id &&
                    this.unreadMessage.Task[item][keys[1]] == this.ActualTaskProjectData.project_id
                ) {
                    this.newMessage = true;
                } else {
                    this.newMessage = false;
                }
            }
            let foundMatch = false;
            for (let item of this.unreadMessage.Task) {
                const values = Object.values(item);
                for (let i = 0; i < values.length - 1; i++) {
                    if (values[i] == task.id && values[i + 1] == task.projectId) {
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
              if (error.response && error.response.status) {
                this.serverError=error
                this.show_error_popup=true
              }
          });
        },
        SwitchStatusModal(task){
          const{data}=task
          this.ActualTaskData.taskData=task.data.taskData
          this.ActualTaskData.projectData=task.data.projectData
          this.tryAgain=false
          ServiceClient.getStatus(task.data.projectData.project_id, task.data.taskData.id).then(statuses=>{
            this.statusDataTravel= statuses
            this.statusDataTravel.priority = this.priorities
            this.showStatusModal = true;
          }).catch(error=>{
            this.serverError=error
            this.show_error_popup=true
          })
        },
        SetStatus(set){
          this.closeErrorModal()
          const{data}=set
          this.tryAgain=true
          ServiceClient.setStatus(this.ActualTaskData.projectData.project_id, this.ActualTaskData.taskData.id, set.data, set.priority.id).then(()=>{
            this.getMyTasks();
            this.show_popup = true;
            setTimeout(() => {
              this.show_popup = false
              this.cancelModal()
            },  1500)
          }).catch(error=>{
            if(error.response){
              this.tryAgain=false
              this.serverError=error
              this.show_error_popup=true
            }
          })
        },
        Completed(task){
          this.closeErrorModal()
          ServiceClient.taskCompleted(task.data.projectData.project_id, task.data.taskData).then(success=>{
            this.message=success
            this.show_popup = true;
            setTimeout(() => {
              this.show_popup = false
              this.message = ""
              this.getMyTasks();
            },  1500)
          }).catch(error=>{
            if(error.response){
              this.serverError=error
              this.show_error_popup=true
            }
          })
        },
        Sort(sortData){
            const{selected, key} = sortData
            for(let e in this.setSortData){
                if(this.setSortData[e].key === sortData.selected.key){
                const index = this.setSortData.indexOf(this.setSortData[e]);
                this.setSortData.splice(index, 1);
                }
            }
            this.setSortData.push(sortData.selected)
            this.getMyTasks();
        },
        clearFilter(){
            this.setSortData=[];
            this.getMyTasks();
        },
        TaskDetails(readOnlydata){
            const{data,readOnlyMode}=readOnlydata
            this.Editdata = readOnlydata.data.taskData,
            this.readOnlyMode = readOnlydata.readOnlyMode,
            this.show_Create_Task_Modal =true
        },
        getUnreadMessages(){
            this.unreadMessage = this.$store.state.unreadMessages
        },
        ShoudShowEnvelope(task){
            let foundMatch = false;
            if(this.unreadMessage && this.unreadMessage !== undefined && this.unreadMessage.Task !== undefined){
                for (let item of this.unreadMessage.Task) {
                    const values = Object.values(item);
                    for (let i = 0; i < values.length - 1; i++) {
                        if (values[i] == task.id && values[i + 1] == task.projectId) {
                            return foundMatch = true
                        
                        }else{
                            foundMatch = false;;
                        }
                    }
                }
            }
        },
        closeErrorModal(){
          this.show_error_popup=false
          this.serverError=''
          this.message=''
        },
    },
    beforeRouteEnter(to, from, next) {
      const userRole = store.state.userRole
      if(userRole.length>0){
        next()
      }else{
        next('/accessdenied')
      }
    },
    beforeMount(){
       this.getUnreadMessages();
    },
    mounted(){
        this.getMyTasks();
        this.getPriorities();
    },
}
</script>


<template>
        <div class="main-container">
        <div class="background component">
        </div>
        <EventHandler
            :error-popup="show_error_popup"
            :success-popup="show_popup"
            :success-message="message"
            :error-message="message"
            :server-error="serverError"
            @close="closeErrorModal"
        />
       
        <div class="content-container"> 
            
            <div class="centerd-component-container">
                
                <div class="scrolling-table-container">
                    <Loader v-if="loader==true"></Loader>
                    <table class="ui selectable striped table">
                        <thead>
                            <tr>
                                <th>TaskID</th>
                                <th>Project</th>
                                <th>Task name</th>
                                <th>Status </th>
                                <th>Priority <Sort :data="this.taskData" :sortKey="'t_priority'" @sorted="Sort" @deleteSelected="clearFilter"></Sort></th>
                                <th>Deadline <Sort :data="this.taskData" :sortKey="'deadline'" @sorted="Sort" @deleteSelected="clearFilter"></Sort></th>
                                <th></th>
                                <th></th>
                               
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="task in myTasks" :key="task.id" :class="rowBackground(task)">
                                <td>{{task.taskData.id}}</td>
                                <td :style="{overflow:'auto', textOverflow:'ellipsis'}">{{task.projectData.name}}</td>
                                <td :style="{overflow:'auto', textOverflow:'ellipsis'}">{{task.taskData.task_name}}</td>
                                <td>{{ task.taskData.status}}</td>
                                <td>{{ task.taskData.priority}}</td>
                                <td>{{ task.taskData.deadline}}</td>
                                <td>
                                    <i v-if="ShoudShowEnvelope(task)" class="red envelope icon"></i>
                                </td>
                                <td>
                                    <CircularMenu
                                        @click="getButtons(task)"
                                        :data="task"
                                        :buttons="this.mergedButtons"
                                        :newMessage="this.newMessage"
                                        @redirect="this.redirect"
                                        @Attach_Modal="this.Attach_Modal"
                                        @showParticipantModal="this.showParticipantModal"
                                        @edit="this.EditingModeSwitch"
                                        @CommentEmit="this.commentModalSwitch"
                                        @SwitchModal="SwitchStatusModal"
                                        @CompletedEmit="Completed"
                                        @TaskDetailsEmit="TaskDetails">
                                    </CircularMenu>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot class="full-width" v-if="loader==false">
                            <tr>
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
            :readOnlyMode="this.readOnlyMode"
            :tryAgain="this.tryAgain"></CreateTaskModal>
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
        :taskData="this.taskDataTravel.taskData"
        :Participants="this.getActiveTaskEmployee"
        :projectId ="this.ActualTaskProjectData.project_id"
        :tryAgain="this.tryAgain"
        :projectData="this.taskDataTravel.projectData"
        ></CommentModal>
        <Status v-if="this.showStatusModal == true"
        @cancel-modal="cancelModal"
        :data="this.statusDataTravel"
        :task="true"
        :tryAgain="this.tryAgain"
        @set-status="SetStatus"></Status>
        
    </div>
</template>



<style scoped>

    i.icon{
        cursor: pointer;
        transition: all .2s ease-in-out; 
    }
    i.icon:hover{
        transform: scale(1.4); 
    }
</style>