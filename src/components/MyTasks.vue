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
    },
    methods:{
        getMyTasks(){
            //this.loader=true;
            let url ="/api/get-my-tasks";
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
        /*jump(task){
            router.push(`/projects/${task.projectId}/tasks`)
        }*/
        Attach_Modal(task){
            this.getProjectParticipants();
            const{data} = task
            this.AttachTask = task.data
            console.log(this.AttachTask.id,"attach_is active")

            let url=`/api/getActiveEmployees/${this.AttachTask.id}`;
            ServiceClient.post(url).then((response) =>{
                console.log(response);
                if (response.status == 200){
                    this.getActiveTaskEmployee = response.data
                    console.log(this.getActiveTaskEmployee, "lokol")
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
           console.log(this.Editdata, "edit data is set null?")
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
            console.log("Bezártad a Modalt")
        },

        createTask(data){
            
            const { task } = data;
            //a task statust szerver oldalon állítom be, minden automatikusan aktiv lesz.
            this.task_name = task.name ;
            this.deadline = task.deadline.replace(/'.'/g, "-");
            this.description = task.description;
            this.t_priority = task.priority;
            this.task_id = task.id;
            console.log(this.deadline, this.task_name, this.description, this.t_priority)
            
           
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
                    console.log(response);
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
            
            console.log(this.assignEmployee, "mackó", this.AttachTask)
            
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
                console.log(this.RemoveData, "REMOVEDATA")
            }
            let dataTravel={};
            dataTravel.requestData = this.RequestData ? this.RequestData:null,
            dataTravel.removeData = this.RemoveData ? this.RemoveData:null,
            dataTravel.task_id = this.AttachTask.id
            dataTravel.project_id = this.ActualTaskData.projectId
            console.log(dataTravel, "TRAVEL")
            let url ="/api/assign-employee-to-task";
            ServiceClient.post(url,dataTravel).then((response) =>{
                console.log(response);
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
                    console.log(this.priorities, "hellóbelló prioriti")
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
            console.log(this.Editdata, "editmode")
            this.show_Create_Task_Modal =true
        },
        commentModalSwitch(kismacska){
            const{data} = kismacska
            this.taskDataTravel = kismacska.data
            console.log(this.taskDataTravel, "kismacskaTaskData")
            let url=`/api/getActiveEmployees/${kismacska.data.id}`;
            ServiceClient.post(url).then((response) =>{
                    console.log(response);
                    if (response.status == 200){
                    this.getActiveTaskEmployee = response.data
                    console.log(this.getActiveTaskEmployee, "lokol")
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
            console.log(emitData, "emitData",projectId);
            let url='/api/send-message';
            ServiceClient.post(url,emitData).then((response) =>{
                    console.log(response);
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
        getButtons(task){
            this.ActualTaskData = task;
            console.log(this.ActualTaskData, "TASKDATA")
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
                       /* this.projectButtons.employee = this.projectButtons.employee.slice(1,2)
                        
                        for(let item in this.projectButtons.employee){
                            this.mergedButtons.push(this.projectButtons.employee[item])
                        }
                        this.projectButtons.employee = this.projectButtons.employee.slice(-1)
                        for(let item in this.projectButtons.employee){
                            this.mergedButtons.push(this.projectButtons.employee[item])
                        } */
                        this.mergedButtons.push(this.projectButtons.employee[1])
                        this.mergedButtons.push(this.projectButtons.employee[3])

                    }  
                    
                    if(this.projectButtons.manager && this.projectButtons.manager.length>0){
                        this.projectButtons.manager = this.projectButtons.manager.slice(1)
                        for(let item in this.projectButtons.manager){
                            this.mergedButtons.push(this.projectButtons.manager[item])
                        }
                    }
                    
                    console.log(this.mergedButtons, "merged");
                    for (let item in this.unreadMessage.Task) {
                        console.log(this.unreadMessage.Task[item]);
                        const keys = Object.keys(this.unreadMessage.Task[item]);
                        console.log(keys, "object.keys(this.unreadMessage.Task[item])");
                    
                        if (
                            this.unreadMessage.Task[item][keys[0]] === task.task_id &&
                            this.unreadMessage.Task[item][keys[1]] == this.ActualTaskData.projectId
                        ) {
                            this.newMessage = true;
                            console.log("match", this.newMessage);
                        } else {
                            this.newMessage = false;
                            console.log("something went wrong",  this.ActualTaskData.projectId);
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
            console.log(statusData, "statusData")
            
            let url=`/api/get-status/${this.ActualTaskData.projectId}/${statusData.data.task_id}`;

            ServiceClient.post(url).then((response) =>{
                if (response.status == 200){
                    console.log(response.data, "responseDATA")
                    for(let item in response.data){
                        this.statusDataTravel= response.data[item]
                    }
                    this.statusDataTravel.priority = this.priorities
                    this.showStatusModal = true;
                    console.log(this.statusDataTravel, "statusDataTravel", )
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

            
            console.log("namizu")

        },
        SetStatus(set){
            const{data}=set
            console.log(set, "SET",JSON.stringify(set.setAllTask));
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
            console.log(dataTravel, "travel")
            let url='/api/set-status';
            ServiceClient.post(url,dataTravel).then((response) =>{
                if (response.status == 200){
                    console.log(response.data, "responseDATA")
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
            console.log(emit, "EMMI")
            let url='/api/completed';

            ServiceClient.post(url,dataTravel).then((response) =>{
                if (response.status == 200){
                    console.log(response.data, "responseDATA")
                    this.message = response.data[0].message;
                    
                    this.show_popup = true;
                    
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
            
            let url='/api/sort'
            let dataTravel={};
            dataTravel.type=sortData.selected.id,
            dataTravel.key=sortData.key,
            dataTravel.data=this.myTasks
            ServiceClient.post(url,dataTravel).then((response) =>{
                if (response.status == 200){
                    console.log(response.data, "responseDATA")
                    this.myTasks = response.data
                    
                    /*this.show_popup = true;
                    
                    setTimeout(() => {
                        this.show_popup = false
                        this.message = ""
                        this.cancelModal()
                    },  1500)*/
                    
                }
            }).catch((error) => {
                if (error.response && error.response.status) {
                    if (error.response.data && error.response.data.message) {
                        this.message = error.response.data.message
                        this.show_error_popup = true
                        this.getTasks();
                        
                        setTimeout(() => {
                            this.show_error_popup = false
                            this.message = ""
                        }, 2000)

                    }
                }
            });


        },
        clearFilter(){
            this.getProjects();
        },
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
                    <table class="ui selectable striped table">
                        <thead>
                            <tr>
                                <th>TaskID</th>
                                <th>Project</th>
                                <th>Task name</th>
                                <th>Status </th>
                                <th>Priority <Sort :data="this.taskData" :sortKey="'priority_id'" @sorted="Sort" @deleteSelected="clearFilter"></Sort></th>
                                <th>Deadline <Sort :data="this.taskData" :sortKey="'deadline'" @sorted="Sort" @deleteSelected="clearFilter"></Sort></th>
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
                                        @CompletedEmit="Completed">
                                    </CircularMenu>
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
        <Transition>
            <CreateTaskModal v-if="show_Create_Task_Modal==true" 
            @cancel-modal="cancelModal"  
            @create-task="createTask" 
            :getusers="this.getusers" 
            :priorities="this.priorities"
            :projectData="this.projectData"
            :EditMode="this.EditMode"
            :EditData="this.Editdata"></CreateTaskModal>
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