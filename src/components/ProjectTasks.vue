
<script>
  import CreateTaskModal from './Modals/CreateTaskModal.vue';
  import ServiceClient from '../ServiceClient';
  import Success_Popup from './Common/Success_Popup.vue';
  import ErrorPopup from './Common/ErrorPopup.vue';
  import TaskAttachModal from './Modals/TaskAttachModal.vue';
  
  

  export default {
    name: "ProjectTasks",

    components: {
        CreateTaskModal,
        Success_Popup,
        ErrorPopup,
        TaskAttachModal,
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

        }
    },
   
    methods:{
       
        toggleDropdownActive(){
            this.isDropdownOpenActive = !this.isDropdownOpenActive;
            console.log("Heyhó Active Dropping")
        },
        Attach_Modal(task){
            
            this.AttachTask = task
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
                let taskId = task.task_id;
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
    
    <!--<div class="HP-title" v-for="project in this.projectData" :key="project.id">
        <h1>Project Name: {{project.name}}</h1>
        <h2>Manager: {{ project.manager }}</h2>
    </div>-->
    <Transition name="drop">
        <Success_Popup v-if="show_popup==true" :message = "this.message"></Success_Popup>
    </Transition>
    <Transition name="drop">
        <ErrorPopup v-if="show_error_popup==true" :message="this.message"></ErrorPopup>
    </Transition>
    <Transition name="drop">
        <AreYouSureModal v-if="show_areyousure_popup==true"></AreYouSureModal>
    </Transition>
    <div class="">
        <button class="ui left floated primary button">Back to projects</button>
    </div>
    <div class="content-container">
        <div class="content-title task" v-for="project in this.projectData" :key="project.id">
            <h1>Project:&nbsp;&nbsp;{{project.name}}</h1>
            <h2>Manager: &nbsp;&nbsp;{{ project.manager }}</h2>
        </div>
    
        <div class="centerd-component-container">
            <div class="scrolling-table-container">
                <table class="ui striped table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Task name</th>
                            <th>Deadline</th>
                            <th>Task Status</th>
                            <th>Task Priority</th>
                            <th>Actions
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
                                <button class="ui normal violet button"><i class="edit icon"></i>Edit Task</button>
                                <button class="ui normal orange button"><i class="users icon"></i>Employees</button>
                                <button class="ui normal green button" @click="Attach_Modal(task)"><i class="user plus icon"></i>Attach To Employee</button>
                                <button class="ui normal green button" @click=" AttachMyself(task)"><i class="user plus icon"></i>Attach To Myself</button>
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
            :projectData="this.projectData"></CreateTaskModal>
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
</div>
</template>