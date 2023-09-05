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
            RemoveData:[],
            setSortData:[],
            readOnlyMode:false,
            tryAgain:null,
        }
    },
    components:{
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
            //this.loader=true;
            let dataTravel={};
            dataTravel.sortData = this.setSortData;
            let url ="/api/get-my-tasks";
            ServiceClient.post(url,dataTravel).then((response) =>{
                if (response.status == 200){
                    this.myTasks=response.data
                    this.loader=false;
                }
            }).catch((error) => {
                    
                if (error.response && error.response.status) {
                    if (error.response.data && error.response.data.message) {
                        this.message= error.response.data.message
                        this.show_popup = true
                        this.loader=false;
                        setTimeout(() => {
                            this.show_popup = false
                            this.message = "";
                        },  2500)
                        
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
       
        Attach_Modal(task){
            this.getProjectParticipants();
            const{data} = task
            this.AttachTask = task.data

            let url=`/api/getActiveEmployees/${this.AttachTask.id}`;
            ServiceClient.post(url).then((response) =>{
                if (response.status == 200){
                    this.getActiveTaskEmployee = response.data
                    if(this.show_Attach_Modal == false){
                        this.show_Attach_Modal = true
                    }
                }
            }).catch((error) => {
                    
                if (error.response && error.response.status) {
                    if (error.response.data && error.response.data.message) {
                        this.message=error.response.data.message
                        this.show_error_popup = true
                        setTimeout(() => {
                            this.show_error_popup = false
                            this.message = "";
                        },  2000)
                        
                    }
                }
            });
        },
        showCreateTaskModal(){
           this.Editdata = null
            if(this.show_Create_Task_Modal==false){
                this.show_Create_Task_Modal = true
            }
            
           
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
            
            const { task } = data;
            //a task statust szerver oldalon állítom be, minden automatikusan aktiv lesz.
            this.task_name = task.name ;
            this.deadline = task.deadline.replace(/'.'/g, "-");
            this.description = task.description;
            this.t_priority = task.priority;
            this.task_id = task.id;
            
           
            this.p_id= this.ActualTaskData.projectId;
            
            
            
            let formData = new FormData();
            formData.append("task_name", this.task_name);
            formData.append("deadline", this.deadline);
            formData.append("description",this.description);
            formData.append("project_id",this.p_id);
            formData.append("task_priority",this.t_priority);
            formData.append("task_id",this.task_id);
            
            

            let url ="/api/createtask";
                ServiceClient.post(url,formData).then((response) =>{
                    if (response.status == 200){
                        this.message=response.data.message
                        this.show_popup = true
                        setTimeout(() => {
                            this.show_popup = false
                            this.getMyTasks();
                            this.cancelModal()
                        },  1500)
                    }
                }).catch((error) => {
                        
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.message= error.response.data.message
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                                this.message="";
                            },  2000)
                            
                        }
                    }
                });
            
        },
        AssignEmployeeToTask(data){
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
            if(data.remove_employee !== undefined){
                this.RemoveData=data.remove_employee;
            }
            let dataTravel={};
            dataTravel.requestData = this.RequestData ? this.RequestData:null,
            dataTravel.removeData = this.RemoveData ? this.RemoveData:null,
            dataTravel.task_id = this.AttachTask.id
            dataTravel.project_id = this.ActualTaskData.projectId
            let url ="/api/assign-employee-to-task";
            ServiceClient.post(url,dataTravel).then((response) =>{
                if (response.status == 200){
                    this.message =response.data.message
                    this.show_popup = true
                    
                    setTimeout(() => {
                        this.show_popup = false
                        this.getMyTasks()
                        this.cancelModal()
                        this.message=""
                    },  1500)
                }
            }).catch((error) => {
                    
                if (error.response && error.response.status) {
                    if (error.response.data && error.response.data.message) {
                        this.message=error.response.data.message
                        this.show_error_popup = true
                        setTimeout(() => {
                            this.show_error_popup = false
                            this.message="";
                            this.cancelModal()
                        },  2000)
                        
                    }
                }
            });
        
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

        getProjectParticipants(){
            let url =`/api/getprojectparticipants/${this.ActualTaskData.projectId}`;
            ServiceClient.post(url).then((response) =>{
                    
                    if (response.status == 200){
                        
                        this.getusers=response.data
                    }
                }).catch((error) => {
                        
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.message=error.response.data.message;
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                                this.message="";
                            },  4500)
                            
                        }
                    }
                });
        },

        
        EditingModeSwitch(kiskutya){
            const {data, switching} = kiskutya
            this.Editdata = kiskutya.data
            this.EditMode = kiskutya.switching;
            this.show_Create_Task_Modal =true
        },
        commentModalSwitch(kismacska){
            const{data} = kismacska
            this.taskDataTravel = kismacska.data
            let url=`/api/getActiveEmployees/${kismacska.data.id}`;
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
            
            projectId = this.ActualTaskData.projectId;
            
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
            let url=`/api/get-buttons/${task.projectId}`
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
                        for(let item in this.projectButtons.employee){
                            if(this.projectButtons.employee[item].label === 'Completed' && task.status === 'Completed'){
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
                            this.unreadMessage.Task[item][keys[1]] == this.ActualTaskData.projectId
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
            
            let url=`/api/get-status/${this.ActualTaskData.projectId}/${statusData.data.task_id}`;

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
            dataTravel.projectId =this.ActualTaskData.projectId
            dataTravel.taskId = this.ActualTaskData.id;
            dataTravel.StatusId= set.data.id;
            dataTravel.priorityId = set.priority.id;
            dataTravel.setAllTask = set.setAllTask;
            dataTravel.setAllPriority = set.setAllPriority;
            let url='/api/set-status';
            ServiceClient.post(url,dataTravel).then((response) =>{
                if (response.status == 200){
                    this.message = response.data.message;
                    
                    this.show_popup = true;
                    this.getMyTasks();
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
           
            
        Completed(emit){
            const{data}=emit;
            this.loader = true;
            let dataTravel={};
            dataTravel.projectId = this.ActualTaskData.projectId
            dataTravel.taskData = emit.data
            dataTravel.taskData.status = "Completed";
            let url='/api/completed';

            ServiceClient.post(url,dataTravel).then((response) =>{
                if (response.status == 200){
                    this.message = response.data[0].message;
                    
                    this.show_popup = true;
                    
                    setTimeout(() => {
                        this.show_popup = false
                        this.message = ""
                        this.cancelModal()
                        this.getMyTasks();
                    },  1500)
                    
                }
            }).catch((error) => {
                if (error.response && error.response.status) {
                    if (error.response.data && error.response.data.message) {
                        this.message = error.response.data.message
                        this.show_error_popup = true
                        this.getMyTasks();
                        
                        setTimeout(() => {
                            this.show_error_popup = false
                            this.message = ""
                        }, 2000)

                    }
                }
            });

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
            this.Editdata = readOnlydata.data,
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
        
        <Transition name="drop">
            <Success_Popup v-if="show_popup==true" :message="this.message"></Success_Popup>
        </Transition>
        <Transition name="drop">
            <ErrorPopup v-if="show_error_popup==true" :message="this.message"></ErrorPopup>
        </Transition>
       
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
                                <td>{{task.id}}</td>
                                <td :style="{overflow:'auto', textOverflow:'ellipsis'}">{{task.projectName}}</td>
                                <td :style="{overflow:'auto', textOverflow:'ellipsis'}">{{task.name}}</td>
                                <td>{{ task.status}}</td>
                                <td>{{ task.priority}}</td>
                                <td>{{ task.deadline}}</td>
                                <td>
                                    <i v-if="ShoudShowEnvelope(task)" class="red envelope icon"></i>
                                </td>
                                <td>
                                   <!--<i class="arrow large alternate circle right icon" @click="jump(task)"></i>-->
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
        :projectId ="this.ActualTaskData.projectId"
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