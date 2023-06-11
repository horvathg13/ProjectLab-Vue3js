
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
        projectData:[]
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
            isDropdownOpenActive:false,
            getusers:Array,
            priorities:Array,
            taskData:Array,
        }
    },
   
    methods:{
       
        toggleDropdownActive(){
            this.isDropdownOpenActive = !this.isDropdownOpenActive;
            console.log("Heyhó Active Dropping")
        },
        Attach_Modal(){
            if(this.show_Attach_Modal == false){
                this.show_Attach_Modal = true
            }
            console.log("attach_is active")
        },
        showCreateTaskModal(){
           
            if(this.show_Create_Task_Modal==false){
                this.show_Create_Task_Modal = true
            }
            
            console.log(this.p_id, "pressd")
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
        

            /*getProjectsById(){
                let url ="http://127.0.0.1:8000/api/getprojects";
                ServiceClient.post(url).then((response) =>{
                        
                        if (response.status == 200){
                            
                            this.getprojects=response.data
                            
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
            },*/

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

            getTasks(p_id){
                let url =`http://127.0.0.1:8000/api/gettasks/${p_id}`

                ServiceClient.post(url).then((response) =>{
                        
                    if (response.status == 200){
                        this.taskData=Object.values(response.data)
                        console.log(this.taskData, "szegény legény")
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
            console.log(this.projectData, "süsü")
            this.p_id = this.projectData[0].project_id
            console.log(this.p_id)
            this.getTasks(this.projectData[0].project_id)
        }
    }

</script>

<template>
    <div class="main-container">
    <div class="background login">
    </div>
    
    <div class="HP-title" v-for="project in this.projectData" :key="project.id">
        <h1>Project Name: {{project.name}}</h1>
        <h2>Manager: {{ project.manager }}</h2>
    </div>
    <Transition name="drop">
        <Success_Popup v-if="show_popup==true"></Success_Popup>
    </Transition>
    <Transition name="drop">
        <ErrorPopup v-if="show_error_popup==true"></ErrorPopup>
    </Transition>
    <Transition name="drop">
        <AreYouSureModal v-if="show_areyousure_popup==true"></AreYouSureModal>
    </Transition>
    <div class="">
        <button class="ui left floated primary button">Back to projects</button>
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
                            <button class="ui normal green button" @click="Attach_Modal"><i class="users icon"></i>Attach To Employee</button>
                            <button class="ui normal green button"><i class="users icon"></i>Attach To Myself</button>
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
            @toggleDrop= "toggleDropdown" 
            @toggleDropActive="toggleDropdownActive"
            :isDropdownOpen="this.isDropdownOpen"
            :isDropdownOpenActive="this.isDropdownOpenActive"></TaskAttachModal>
    </Transition>
</div>
</template>