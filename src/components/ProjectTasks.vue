
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
  import Loader from './Common/Loading.vue';
  import {store} from '../VuexStore';
  import EventHandler from "@/components/Common/EventHandler/eventHandler.vue";
  import * as Promis from "axios";

  export default {
    name: "ProjectTasks",

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
            taskData:[],
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
            tryAgain:null,
            serverError:''
        }
    },
    watch: {
        '$store.state.unreadMessages'(newValue) {
            this.unreadMessage = newValue;
        }
    },
   
    methods:{
        Attach_Modal(task){
            const{data} = task
            this.AttachTask = task.data
            ServiceClient.getActiveEmployees(task.data.task_id).then((employees)=>{
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
        },
        showCreateTaskModal(){
           this.Editdata = null
           this.tryAgain=null
           this.createNewTask=true
            if(this.show_Create_Task_Modal==false){
                this.show_Create_Task_Modal = true
            }
        },

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
            this.readOnlyMode=null,
            this.tryAgain=null,
            this.createNewTask=false
            this.newMessage=false
        },

        createTask(data){
            this.closeErrorModal()
            this.tryAgain=true;
            const { task } = data
            ServiceClient.createTask(this.$route.params.id, task.name, task.deadline, task.description, task.priority, task.id).then((success)=>{
              this.show_popup = true
              setTimeout(() => {
                this.show_popup = false
                this.getTasks();
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
                            task_id: this.AttachTask.task_id,
                            task_name: this.AttachTask.task_name
                        };
                    });
                }
                if(data.remove_employee !== null){
                    this.RemoveData=data.remove_employee;
                }
                Promis.all([
                ServiceClient.assignEmployeeToTask(this.RequestData,this.RemoveData,this.AttachTask.task_id,this.$route.params.id).then((success)=>{
                  this.show_popup = true
                  setTimeout(() => {
                    this.show_popup = false
                    this.getTasks();
                    this.message=""
                  },  1500)
                  this.RequestData=[];
                  this.RemoveData=[];
                }).catch(error=>{
                  this.RequestData=[];
                  this.RemoveData=[];
                  if(error.response){
                    this.tryAgain=false;
                    this.RequestData=[];
                    this.serverError=error
                    this.show_error_popup=true
                  }
                }),
                ServiceClient.getProjectParticipants(this.$route.params.id).then(participants=>{
                  this.getusers = participants
                }).catch((error) => {
                  if (error.response.data && error.response.data.message) {
                    this.message= error.response.data.message
                    this.show_error_popup = true
                  }
                }),
                ServiceClient.getActiveEmployees(this.AttachTask.task_id).then((employees)=>{
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

            getProjectsById(){
                ServiceClient.getProjectById(this.$route.params.id).then((projects)=>{
                  this.projectData=projects
                }).catch(error=>{
                  if(error.response){
                    this.serverError=error
                    this.show_error_popup=true
                  }
                })
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
              ServiceClient.getTasks(this.$route.params.id, this.setSortData,this.setFilterData).then((tasks)=>{
                tasks.map((e)=>{
                  if(e.taskData){
                    this.taskData.push(e.taskData)
                  }
                  if(e.roles){
                    this.managerRole = e.roles?.haveManagerRole
                    this.adminRole = e.roles?.haveAdminRole,
                    this.participantRole = e.roles?.haveParticipantRole
                  }
                })
                this.loader=false;
              }).catch((error)=>{
                if(error.response){
                  this.serverError=error
                  this.show_error_popup=true
                  this.loader=false;
                  if(error.response.data.haveManagerRole){
                    this.managerRole =error.response.data.haveManagerRole
                  }
                  if(error.response.data.haveAdminRole){
                    this.adminRole = error.response.data.haveAdminRole
                  }
                  if(error.response.data.haveParticipantRole){
                    this.participantRole = error.response.data.haveParticipantRole
                  }
                }
              })
            },
            getProjectParticipants(){
              ServiceClient.getProjectParticipants(this.$route.params.id).then(participants=>{
                this.getusers = participants
              }).catch((error) => {
                if (error.response.data && error.response.data.message) {
                  this.message= error.response.data.message
                  this.show_error_popup = true
                }
              });
            },

            AttachMyself(task){
              this.closeErrorModal()
                const {data} = task
                ServiceClient.taskAttachToMyself(this.$route.params.id, task.data.task_id).then((success)=>{
                  this.show_popup = true
                  setTimeout(() => {
                    this.show_popup = false
                    this.getTasks();
                    this.message="";
                  },  1500)
                }).catch((error)=>{
                  if(error.response){
                    this.serverError=error
                    this.show_error_popup=true
                  }
                })
            },
            EditingModeSwitch(kiskutya){
                const {data, switching} = kiskutya
                this.Editdata = kiskutya.data
                this.EditMode = kiskutya.switching;
                this.show_Create_Task_Modal =true
            },
            TaskDetails(readOnlydata){
                const{data,readOnlyMode}=readOnlydata
                this.Editdata = readOnlydata.data,
                this.readOnlyMode = readOnlydata.readOnlyMode,
                this.show_Create_Task_Modal =true
            },
            commentModalSwitch(kismacska){
              const {data} = kismacska;
              this.taskDataTravel = kismacska.data
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
              ServiceClient.sendMessage(message,this.projectData.project_id,this.taskDataTravel.task_id).then(response=>{
                this.tryAgain=false
              }).catch(error=>{
                this.tryAgain=false
                this.serverError=error
                this.show_error_popup=true
              })
            },
            getButtons(task){
              this.ActualTaskData = task;
              this.mergedButtons=[];
              ServiceClient.buttonAuth(this.$route.params.id).then((rights)=>{
                let isHaveGlobalManagerRole= store.state.userRole.some(i=>i.role==="Manager");
                let isHaveGlobalAdminRole=store.state.userRole.some(i=>i.role==='Admin');
                let isHaveGlobalEmployeeRole=store.state.userRole.some(i=>i.role==="Employee");

                if(isHaveGlobalManagerRole && rights.manager || isHaveGlobalAdminRole){
                  this.mergedButtons.push(...store.state.TASKS.MANAGERBUTTONS)
                }
                if(isHaveGlobalEmployeeRole && rights.employee && !isHaveGlobalAdminRole){
                  this.mergedButtons.push(...store.state.TASKS.EMPLOYEEBUTTONS)
                }
              }).catch(error=>{
                if(error.response){
                  this.serverError=error;
                  this.show_error_popup = true
                }
              })
            },
            SwitchStatusModal(statusData){
              const{data}=statusData
              this.tryAgain=false
              ServiceClient.getStatus(statusData.data.project_id, statusData.data.task_id).then(statuses=>{
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
              const{data,priority}=set
              this.tryAgain=true
              if(data !== "" || priority !== "") {

                ServiceClient.setStatus(this.projectData.project_id, this.ActualTaskData.task_id, data, priority).then(() => {
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
            getFilterData(){
              ServiceClient.getStatus(null, this.ActualTaskData.task_id).then(statuses=>{
                this.statusDataTravel= statuses.map((u)=>({id: u.id, name: u.task_status}))
              }).catch(error=>{
                this.serverError=error
                this.show_error_popup=true
              })
            },
            filter(selectData){
              const{select}=selectData
              for(let e in this.setFilterData){
                if(this.setFilterData[e].name === selectData.select.name){
                  const index = this.setSortData.indexOf(this.setFilterData[e]);
                  this.setFilterData.splice(index, 1);
                }
              }
              this.setFilterData.push(selectData.select);
              this.getTasks();
            },
            clearFilter(){
                this.setFilterData=[]
                this.getTasks();
            },
            Completed(emit){
              this.closeErrorModal()
                const{data}=emit;
                this.loader = true;
                ServiceClient.taskCompleted(this.$route.params.id, emit.data).then(success=>{
                  this.message=success
                  this.show_popup = true;
                  setTimeout(() => {
                    this.show_popup = false
                    this.message = ""
                    this.getTasks();
                  },  1500)
                }).catch(error=>{
                  this.loader = false;
                  if(error.response){
                    this.serverError=error
                    this.show_error_popup=true
                  }
                })
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
            Sort(sortData){
                const{selected, key} = sortData
                for(let e in this.setSortData){
                    if(this.setSortData[e].key === sortData.selected.key){
                        const index = this.setSortData.indexOf(this.setSortData[e]);
                        this.setSortData.splice(index, 1);
                    }
                }
                this.setSortData.push(sortData.selected)
                this.getTasks()
            },
            clearSort(clearKey){
                for(let e in this.setSortData){
                    if(this.setSortData[e].key === clearKey.key){
                        const index = this.setSortData.indexOf(this.setSortData[e]);
                        this.setSortData.splice(index, 1);
                    }
                }
                this.getTasks()
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
                            if (values[i] == task.task_id && values[i + 1] == this.$route.params.id) {
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
              this.serverError=[]
              this.message=''
              this.errorArray=[]
            },
        },
        beforeRouteEnter(to,from, next){
          const userRole = store.state.userRole
          if(userRole.length>0){
            userRole.map(i=>{})
            next()
          }else{
            next('/accessdenied')
          }
        },
        mounted(){
          this.getPriorities()
          this.getProjectsById()
          this.getProjectParticipants()
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
            <div class="content-title task" v-if="this.loader===false">
                <h1>{{projectData.name}}</h1>
            </div>
            <div class="scrolling-table-container">
                <Loader v-if="loader===true"></Loader>
                <table class="ui selectable striped table" >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Deadline <Sort :data="this.taskData" :sortKey="'deadline'" @sorted="Sort" @deleteSelected="clearSort"></Sort></th>
                            <th>Status <Filter :data="this.statusDataTravel" @select="filter" @deleteSelected="clearFilter" @click="getFilterData"></Filter></th>
                            <th>Priority <Sort :data="this.taskData" :sortKey="'t_priority'" @sorted="Sort" @deleteSelected="clearSort"></Sort></th>
                            <th>Employees</th>
                            <th></th>
                            <th>
                            <button v-if="this.managerRole==true || this.adminRole==true || this.participantRole==true" class="ui small primary labeled icon button" @click="showCreateTaskModal()"><i class="tasks icon"></i>New</button></th>
                        </tr>
                    </thead>
                    <tbody v-if="loader==false">
                        <tr v-for="task in taskData" :key="task.task_id" :class="rowBackground(task)">
                            <td>{{ task.task_id }}</td>
                            <td :style="{overflow:'hidden', textOverflow:'ellipsis'}">{{task.task_name }}</td>
                            <td>{{task.deadline }}</td>
                            <td>{{task.status }}</td>
                            <td>{{ task.priority}}</td>
                            <td>{{ task.employees }}</td>
                            <td >
                                <i v-if="task.mytask === true" class="assigned-icon"></i>
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
            :tryAgain="this.tryAgain"
            :createNewTask="this.createNewTask"></CreateTaskModal>
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
    :projectData="this.projectData"
    :taskData="this.taskDataTravel"
    :Participants="this.getActiveTaskEmployee"
    :projectId ="this.$route.params.id"
    :tryAgain="this.tryAgain"></CommentModal>
    <Status v-if="this.showStatusModal == true"
    @cancel-modal="cancelModal"
    :data="this.statusDataTravel"
    :task="true"
    :tryAgain="this.tryAgain"
    @set-status="SetStatus"></Status>
</div>
</template>

<style scoped>

</style>