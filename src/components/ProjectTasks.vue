
<script>
  import CreateTaskModal from './Modals/CreateTaskModal.vue';
  import ServiceClient from '../ServiceClient';
  import Success_Popup from './Common/Success_Popup.vue';
  import ErrorPopup from './Common/ErrorPopup.vue';
  import TaskAttachModal from './Modals/TaskAttachModal.vue';
  import CircularMenu from './Common/CircularMenu.vue';
  import CommentModal from './Modals/CommentModal.vue'
  
  

  export default {
    name: "ProjectTasks",

    components: {
        CreateTaskModal,
        Success_Popup,
        ErrorPopup,
        TaskAttachModal,
        CircularMenu,
        CommentModal,
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
            taskDataTravel:Array

        }
    },
   
    methods:{
       
        toggleDropdownActive(){
            this.isDropdownOpenActive = !this.isDropdownOpenActive;
            console.log("Heyhó Active Dropping")
        },
        Attach_Modal(task){
            const{data} = task
            this.AttachTask = task.data
            console.log(this.AttachTask.task_id,"attach_is active")

            let url=`http://127.0.0.1:8000/api/getActiveEmployees/${this.AttachTask.task_id}`;
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
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                            },  2000)
                            
                        }
                    }
                });
        },
        showCreateTaskModal(){
           
            if(this.show_Create_Task_Modal==false){
                this.show_Create_Task_Modal = true
            }
            
           
        },

        cancelModal(){
            this.show_Create_Task_Modal = false
            this.show_Attach_Modal = false
            this.show_Comment_Modal = false
            this.getTasks(this.p_id)
            console.log("szevasz")
        },

        createTask(data){
            
            const { task } = data;
            //a task statust szerver oldalon állítom be, minden automatikusan aktiv lesz.
            this.task_name = task.name ;
            this.deadline = task.deadline;
            this.description = task.description;
            this.t_priority = task.priority;
            console.log(this.deadline, this.task_name, this.description, this.t_priority)
            
            for(let p in this.projectData){
                this.p_id= this.projectData[p].project_id;
            }
            
            
            let formData = new FormData();
            formData.append("task_name", this.task_name);
            formData.append("deadline", this.deadline);
            formData.append("description",this.description);
            formData.append("project_id",this.p_id);
            formData.append("task_priority",this.t_priority);

            let url ="http://127.0.0.1:8000/api/createtask";
                ServiceClient.post(url,formData).then((response) =>{
                    console.log(response);
                    if (response.status == 200){
                        this.show_popup = true
                        setTimeout(() => {
                            this.show_popup = false
                            this.cancelModal()
                        },  1500)
                    }
                }).catch((error) => {
                        
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                            },  2000)
                            
                        }
                    }
                });
            
            },
            AssignEmployeeToTask(data){
                const {selected_employee}=data
                this.assignEmployee=data.selected_employee.select;
                console.log(this.assignEmployee, "mackó", this.AttachTask)
                
                this.RequestData = this.assignEmployee.map(employee => {
                    return {
                    id: employee.id,
                    name: employee.name,
                    deadline: this.AttachTask.dedadline,
                    description: this.AttachTask.description,
                    task_status: this.AttachTask.status,
                    task_id: this.AttachTask.task_id,
                    task_name: this.AttachTask.task_name
                    };
                });

                let url ="http://127.0.0.1:8000/api/assign-employee-to-task";
                ServiceClient.post(url,this.RequestData, {headers:{ 'Content-Type': 'application/json'}}).then((response) =>{
                    console.log(response);
                    if (response.status == 200){
                        this.show_popup = true
                        setTimeout(() => {
                            this.show_popup = false
                            this.cancelModal()
                        },  1500)
                    }
                }).catch((error) => {
                        
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                            },  2000)
                            
                        }
                    }
                });
            
            },
            
        

            getProjectsById(){
                let url =`http://127.0.0.1:8000/api/projects/${this.$route.params.id}`;
                ServiceClient.post(url).then((response) =>{
                        
                        if (response.status == 200){
                            
                            this.projectData=response.data
                            console.log(this.projectData)
                        }
                    }).catch((error) => {
                            
                        if (error.response && error.response.status) {
                            if (error.response.data && error.response.data.message) {
                                this.message = error.response.data.message
                                this.show_error_popup = true
                                setTimeout(() => {
                                    this.show_error_popup = false
                                },  2000)
                                
                            }
                        }
                    });
            },

            getTaskEmployee(){
                let url ="http://127.0.0.1:8000/api/get-task-employee";
                ServiceClient.post(url).then((response) =>{
                        
                        if (response.status == 200){
                            this.getusers=response.data
                        }
                    }).catch((error) => {
                            
                        if (error.response && error.response.status) {
                            if (error.response.data && error.response.data.message) {
                                this.show_error_popup = true
                                setTimeout(() => {
                                    this.show_error_popup = false
                                },  2000)
                                
                            }
                        }
                    });
            },

            getPriorities(){
                let url ="http://127.0.0.1:8000/api/getpriorities";
                ServiceClient.post(url).then((response) =>{
                        
                    if (response.status == 200){
                        this.priorities=response.data.data
                        console.log(this.priorities, "hellóbelló prioriti")
                    }
                }).catch((error) => {
                        
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                            },  2000)
                            
                        }
                    }
                });

            },

            getTasks(){
                let url =`http://127.0.0.1:8000/api/projects/${this.$route.params.id}/tasks`

                ServiceClient.post(url).then((response) =>{
                        
                    if (response.status == 200){
                        this.taskData=response.data
                        console.log(this.taskData, "szegény legény")
                    }
                }).catch((error) => {
                        
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.message = error.response.data.message
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                            },  2000)
                            
                        }
                    }
                });

            },
            getProjectParticipants(){
                let url =`http://127.0.0.1:8000/api/getprojectparticipants/${this.$route.params.id}`;
                ServiceClient.post(url).then((response) =>{
                        
                        if (response.status == 200){
                           
                            this.getusers=response.data
                        }
                    }).catch((error) => {
                            
                        if (error.response && error.response.status) {
                            if (error.response.data && error.response.data.message) {
                                this.show_error_popup = true
                                setTimeout(() => {
                                    this.show_error_popup = false
                                },  4500)
                                
                            }
                        }
                    });
            },

            AttachMyself(task){
                const {data} = task
                let taskId = task.data.task_id;
                let projectId = null;
                for(let p in this.projectData){
                projectId = this.projectData[p].project_id;
                }
               
                console.log(taskId, projectId, "lolo")
                let url = `http://127.0.0.1:8000/api/projects/${projectId}/tasks/${taskId}`;

                ServiceClient.post(url).then((response) =>{
                        
                    if (response.status == 200){
                        this.message = response.data.message 
                        this.show_popup = true
                        setTimeout(() => {
                            this.show_popup = false
                            this.cancelModal()
                        },  1500)
                    }
                }).catch((error) => {
                        
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.message = error.response.data.message;
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
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
                console.log(this.taskData, "kismacskaTaskData")
                let url=`http://127.0.0.1:8000/api/getActiveEmployees/${kismacska.data.task_id}`;
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
                                this.show_error_popup = true
                                setTimeout(() => {
                                    this.show_error_popup = false
                                },  2000)
                                
                            }
                        }
                    });
                
            },
            SendMessage(emitData){
                const{participants,message,data} = emitData
                let projectId = null;
                for(let p in this.projectData){
                projectId = this.projectData[p].project_id;
                }
                console.log(emitData, "emitData", projectId, "p_id")
                let url=`http://127.0.0.1:8000/api/send-message/${encodeURIComponent(JSON.stringify(emitData))}/${projectId}`;

                ServiceClient.post(url).then((response) =>{
                        console.log(response);
                        if (response.status == 200){
                            this.show_popup=true
                            setTimeout(() => {
                            this.show_popup = false
                            this.cancelModal()
                        },  1500)
                        }
                    }).catch((error) => {
                            
                        if (error.response && error.response.status) {
                            if (error.response.data && error.response.data.message) {
                                this.show_error_popup = true
                                setTimeout(() => {
                                    this.show_error_popup = false
                                },  2000)
                                
                            }
                        }
                    });

            }


            
        },
        mounted(){
            this.getPriorities()
            this.getProjectsById()
            this.getProjectParticipants()
            this.getTasks()
            console.log(this.$route)
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
        <ErrorPopup v-if="show_error_popup==true" :message="this.message"></ErrorPopup>
    </Transition>
    <Transition name="drop">
        <AreYouSureModal v-if="show_areyousure_popup==true"></AreYouSureModal>
    </Transition>
    
    <div class="content-container">
        
    
        <div class="centerd-component-container">
            <div class="content-title task" v-for="project in this.projectData" :key="project.id">
            <h1>{{project.name}}</h1>
            <h2>{{ project.manager }}</h2>
            </div>
            <div class="scrolling-table-container">
                <table class="ui selectable striped table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Task name</th>
                            <th>Deadline</th>
                            <th>Task Status</th>
                            <th>Task Priority</th>
                            <th>
                            <button class="ui right floated small primary labeled icon button" @click="showCreateTaskModal()"><i class="tasks icon"></i>New Task</button></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="task in taskData" :key="task.task_id">
                            <td>{{ task.task_id }}</td>
                            <td>{{task.task_name }}</td>
                            <td>{{task.dedadline }}</td>
                            <td>{{task.status }}</td>
                            <td>{{ task.priority}}</td>
                        
                            <td>
                                <CircularMenu
                                  :data="task"
                                  :component="this.$route.name"
                                  @Attach_Modal="this.Attach_Modal"
                                  @AttachMyself="this.AttachMyself"
                                  @edit="this.EditingModeSwitch"
                                  @CommentEmit="this.commentModalSwitch">
                                </CircularMenu>
                                
                            </td>
                        
                            
                            
                        
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
    :Participants="this.getActiveTaskEmployee"></CommentModal>
</div>
</template>

