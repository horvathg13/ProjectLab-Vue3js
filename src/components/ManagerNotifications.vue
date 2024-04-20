
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

  export default {
    name: "ProjectTasks",

    components: {
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
        }
    },
    watch: {
        '$store.state.unreadMessages'(newValue) {
            this.unreadMessage = newValue;
        }
    },
   
    methods:{
        accessControll(){
            ServiceClient.post('/api/getUserRole').then(response => {
                if(response.status === 200){
                    this.userRole = response.data
                    if(this.userRole.code !== 404){
                        const isAdmin= this.userRole.some(item=>item.role === "Admin" || item.role === "Manager");
                        if(isAdmin === false){this.$router.push("/accessdenied")}
                    }else{
                        this.$router.push("/accessdenied")
                    }
                }
                
            }).catch(error =>{
                console.log(error);
            });
                
            
        },
        toggleDropdownActive(){
            this.isDropdownOpenActive = !this.isDropdownOpenActive;
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
            this.readOnlyMode=false
        },

            getPriorities(){
                let url ="/api/getpriorities";
                ServiceClient.post(url).then((response) =>{
                        
                    if (response.status == 200){
                        this.priorities=response.data.data
                    }
                }).catch((error) => {
                        
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.message=error.response.data.message;
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                                this.message="";
                            },  2000)
                            
                        }
                    }
                });

            },
           
            getTasks(){
                this.loader=true;
                let dataTravel={};
                let url ='/api/managed-completed-tasks'

                ServiceClient.post(url,).then((response) =>{
                        
                    if (response.status == 200){
                        this.taskData=response.data
                        this.managerRole = response.data[0].haveManagerRole
                        this.showButton=true,
                        this.loader=false;
                    }
                }).catch((error) => {
                        
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.message = error.response.data.message
                            this.managerRole = error.response.data.haveManagerRole
                            this.show_error_popup = true
                            this.showButton=false,
                            this.taskData=[];
                            this.loader=false;
                            setTimeout(() => {
                                this.show_error_popup = false
                                this.message = "";
                            },  2000)
                            
                        }
                    }
                });

            },
            TaskDetails(readOnlydata){
                const{data,readOnlyMode}=readOnlydata
                this.Editdata = readOnlydata.data,
                this.readOnlyMode = readOnlydata.readOnlyMode,
                this.show_Create_Task_Modal =true
            },
            commentModalSwitch(kismacska){
                const{data} = kismacska
                this.taskDataTravel = kismacska.data
                let url=`/api/getActiveEmployees/${kismacska.data.task_id}`;
                ServiceClient.post(url).then((response) =>{
                        if (response.status == 200){
                        this.getActiveTaskEmployee = response.data
                        this.show_Comment_Modal = true
                        }
                    }).catch((error) => {
                            
                        if (error.response && error.response.status) {
                            if (error.response.data && error.response.data.message) {
                                this.message=error.response.message;
                                this.show_error_popup = true
                                setTimeout(() => {
                                    this.show_error_popup = false
                                    this.message="";
                                },  2000)
                                
                            }
                        }
                    });
                
            },
            SendMessage(emitData){
                const{participants,message,data} = emitData
                let projectId = null;
               
                projectId = this.projectData.project_id;
                
                emitData.projectId = projectId
                let url='/api/send-message';
                ServiceClient.post(url,emitData).then((response) =>{
                        if (response.status == 200){
                            this.message = response.data.message;
                            this.show_popup=true
                            setTimeout(() => {
                            this.show_popup = false
                            this.cancelModal()
                            this.message = "";
                        },  1500)
                        }
                    }).catch((error) => {
                        this.tryAgain=null;
                        if (error.response && error.response.status) {
                            if (error.response.data && error.response.data.message) {
                                this.message=error.response.data.message
                                this.show_error_popup = true
                                setTimeout(() => {
                                    this.show_error_popup = false
                                    this.message = "";
                                    this.tryAgain=false;
                                },  2000)
                                
                            }
                        }
                    });

            },
            getButtons(task){
               this.ActualTaskData = task;
               this.projectData.project_id= task.p_id
               let url=`/api/get-buttons/${this.projectData.project_id}`
               ServiceClient.post(url).then(response => {
                   if (response.status == 200){
                       this.projectButtons = {};
                       this.mergedButtons = [];

                       for(let i in response.data){
                           for(let item in response.data[i]){
                              
                               if(item == "employee"){
                                   this.projectButtons.employee= response.data[i][item]
                               }else if(item == "manager"){
                                   this.projectButtons.manager= response.data[i][item]
                               }
                           }
                       }
                       
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
                                if (values[i] == task.task_id && values[i + 1] == this.projectData.project_id) {
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
                    }  
                }).catch((error) => {
                   if (error.response && error.response.status) {
                       if (error.response.data && error.response.data.message) {
                           this.message = error.response.data.message
                           this.show_error_popup = true
                           setTimeout(() => {
                               this.show_error_popup = false
                               this.message = ""
                           }, 2000)

                       }
                   }
               });   
               
               
            },
            SwitchStatusModal(statusData){
                const{data}=statusData
                
                let url=`/api/get-status/${this.projectData.project_id}/${statusData.data.task_id}`;

                ServiceClient.post(url).then((response) =>{
                    if (response.status == 200){
                        for(let item in response.data){
                            this.statusDataTravel= response.data[item]
                        }
                        this.statusDataTravel.priority = this.priorities
                        this.showStatusModal = true;
                    }
                }).catch((error) => {
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.message = error.response.data.message
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                                this.message = ""
                            }, 2000)

                        }
                    }
                });

                

            },
            SetStatus(set){
                const{data}=set
                if(Object.keys(set.priority).length == 0){
                    set.priority.id = null
                }
                let dataTravel={}
                dataTravel.projectId =this.projectData.project_id;
                dataTravel.taskId = this.ActualTaskData.task_id;
                dataTravel.StatusId= set.data.id;
                dataTravel.priorityId = set.priority.id;
                dataTravel.setAllTask = set.setAllTask;
                dataTravel.setAllPriority = set.setAllPriority;

                let url='/api/set-status';
                ServiceClient.post(url,dataTravel).then((response) =>{
                    if (response.status == 200){
                        this.message = response.data.message;
                        this.show_popup = true;
                        this.managerNotificationUpdate();
                        this.getTasks();
                        setTimeout(() => {
                            this.show_popup = false
                            this.message = ""
                            this.cancelModal()
                        },  1500)
                        
                    }
                }).catch((error) => {
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.message = error.response.data.message
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                                this.message = ""
                            }, 2000)

                        }
                    }
                });
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
                    let url='/api/accept-all-task';
                    ServiceClient.post(url).then((response) =>{
                        if (response.status == 200){
                            this.message = response.data.message;
                            this.show_popup = true;
                            this.managerNotificationUpdate()
                            setTimeout(() => {
                                this.show_popup = false
                                this.message = ""
                                this.getTasks();
                            },  1500)
                            
                        }
                    }).catch((error) => {
                        if (error.response && error.response.status) {
                            if (error.response.data && error.response.data.message) {
                                this.message = error.response.data.message
                                this.show_error_popup = true
                                setTimeout(() => {
                                    this.show_error_popup = false
                                    this.message = ""
                                }, 2000)

                            }
                        }
                    });
                }
                
            },
            managerNotificationUpdate(){
                ServiceClient.post('/api/get-manager-notification').then(response => {
                    store.commit("getManagerNotifications",response.data);
                }).catch(error =>{
                    console.log(error);
                });
            },


            
        },
        beforeRouteEnter (to, from, next) {
            ServiceClient.post('/api/getUserRole').then(response => {
                if(response.status === 200){
                    const userRole = response.data
                    if(userRole.code !== 404){
                        const isManager= userRole.some(item=>item.role === "Manager");
                        if(isManager === false){
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
    <Transition name="drop">
        <Success_Popup v-if="show_popup==true" :message = "this.message"></Success_Popup>
    </Transition>
    <Transition name="drop">
        <ErrorPopup v-if="show_error_popup==true" :message="this.message" :errorarray="this.errorArray"></ErrorPopup>
    </Transition>
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
    :taskData="this.taskDataTravel"
    :Participants="this.getActiveTaskEmployee"
    :projectId ="this.projectData.project_id"
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