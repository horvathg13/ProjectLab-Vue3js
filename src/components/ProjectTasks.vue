
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
            tryAgain:null,
            createNewTask:false
        }
    },
    watch: {
        '$store.state.unreadMessages'(newValue) {
            this.unreadMessage = newValue;
            console.log(this.unreadMessage, "hello from watch");
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
            console.log("attach_is active", task.data)

            let url=`/api/getActiveEmployees/${task.data.task_id}`;
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
           this.tryAgain=null
           this.createNewTask=true
           console.log(this.Editdata, "edit data is set null?")
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
            //this.getTasks(this.p_id)
            this.projectButtons = {},
            this.mergedButtons=[],
            this.showStatusModal =false,
            this.assignEmployee=[],
            this.RequestData=[],
            this.RemoveData=[];
            this.readOnlyMode=null,
            this.tryAgai=null,
            this.createNewTask=false
            console.log("Bezártad a Modalt")
        },

        createTask(data){
            this.tryAgain=null;
            const { task } = data;
            //a task statust szerver oldalon állítom be, minden automatikusan aktiv lesz.
            this.task_name = task.name ;
            this.deadline = task.deadline;
            this.description = task.description;
            this.t_priority = task.priority;
            this.task_id = task.id;
            console.log(this.deadline, this.task_name, this.description, this.t_priority)
            
           
            this.p_id= this.projectData.project_id;
            
            
            
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
                        this.show_popup = true
                        setTimeout(() => {
                            this.show_popup = false
                            this.getTasks();
                            this.cancelModal();
                        },  1500)
                    }
                }).catch((error) => {
                        
                    if (error.response && error.response.status) {
                        if(error.response.data.validatorError){
                            this.errorArray=error.response.data.validatorError
                            console.log( this.errorArray)
                            this.show_error_popup=true
                            setTimeout(() => {
                                this.show_error_popup = false
                                this.errorArray=[];
                                this.tryAgain=false;
                            },  2000)
                        }
                        if (error.response.data && error.response.data.message) {
                            this.message= error.response.data.message
                            console.log(this.message, "ERRORMESSAGE")
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
                            task_id: this.AttachTask.task_id,
                            task_name: this.AttachTask.task_name
                        };
                    });
                }
                if(data.remove_employee !== null){
                    this.RemoveData=data.remove_employee;
                    console.log(this.RemoveData, "REMOVEDATA")
                }
                let dataTravel={};
                dataTravel.requestData = this.RequestData,
                dataTravel.removeData = this.RemoveData,
                dataTravel.task_id = this.AttachTask.task_id
                dataTravel.project_id = this.$route.params.id
                let url ="/api/assign-employee-to-task";
                ServiceClient.post(url,dataTravel).then((response) =>{
                    console.log(response);
                    if (response.status == 200){
                        this.message =response.data.message
                        this.show_popup = true
                        setTimeout(() => {
                            this.show_popup = false
                            this.getTasks();
                            this.cancelModal();
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
                            },  2000)
                            
                        }
                    }
                });
            
            },
            
        

            getProjectsById(){
                let url =`/api/projects/${this.$route.params.id}`;
                ServiceClient.post(url).then((response) =>{
                        
                        if (response.status == 200){
                            
                            this.projectData=response.data
                            console.log(this.projectData, "ProjectData")
                        }
                    }).catch((error) => {
                            
                        if (error.response && error.response.status) {
                            if (error.response.data && error.response.data.message) {
                                this.message = error.response.data.message
                                this.show_error_popup = true
                                setTimeout(() => {
                                    this.show_error_popup = false
                                    this.message="";
                                },  2000)
                                
                            }
                        }
                    });
            },

            /*getTaskEmployee(){
                let url ="/api/get-task-employee";
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
            },*/

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
           
            getTasks(){
                this.loader=true;
                let dataTravel={};
                dataTravel.projectId=this.$route.params.id;
                dataTravel.sortData = this.setSortData,
                dataTravel.filterData=this.setFilterData
                console.log(dataTravel, "travel");
                let url =`/api/projects/${this.$route.params.id}/tasks`

                ServiceClient.post(url,dataTravel).then((response) =>{
                        
                    if (response.status == 200){
                        this.taskData=response.data
                        this.managerRole = response.data[0].haveManagerRole
                        this.adminRole = response.data[0].haveAdminRole,
                        this.participantRole = response.data[0].haveParticipantRole,
                        console.log(this.taskData, "szegény legény")
                        this.loader=false;
                    }
                }).catch((error) => {
                        
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.message = error.response.data.message
                            this.managerRole = error.response.data.haveManagerRole
                            console.log(error.response.data)
                            this.show_error_popup = true
                            this.loader=false;
                            setTimeout(() => {
                                this.show_error_popup = false
                                this.message = "";
                            },  2000)
                            
                        }
                    }
                });

            },
            getProjectParticipants(){
                let url =`/api/getprojectparticipants/${this.$route.params.id}`;
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

            AttachMyself(task){
                const {data} = task
                let taskId = task.data.task_id;
                let projectId = null;
               
                projectId = this.projectData.project_id;
                
               
                console.log(taskId, projectId, "lolo")
                let url = `/api/projects/${projectId}/tasks/${taskId}`;

                ServiceClient.post(url).then((response) =>{
                        
                    if (response.status == 200){
                        this.message = response.data.message 
                        this.show_popup = true
                        setTimeout(() => {
                            this.show_popup = false
                            this.getTasks();
                            this.message="";
                        },  1500)
                    }
                }).catch((error) => {
                        
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.message = error.response.data.message;
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
            TaskDetails(readOnlydata){
                const{data,readOnlyMode}=readOnlydata
                console.log(readOnlydata.data, "READONLY")
                this.Editdata = readOnlydata.data,
                this.readOnlyMode = readOnlydata.readOnlyMode,
                this.show_Create_Task_Modal =true
            },
            commentModalSwitch(kismacska){
                const{data} = kismacska
                this.taskDataTravel = kismacska.data
                console.log(this.taskData, "kismacskaTaskData")
                let url=`/api/getActiveEmployees/${kismacska.data.task_id}`;
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
               
                projectId = this.projectData.project_id;
                
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
               let url=`/api/get-buttons/${this.$route.params.id}`
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
                           this.projectButtons.employee = this.projectButtons.employee.slice(1,5)
                           for(let item in this.projectButtons.employee){
                               this.mergedButtons.push(this.projectButtons.employee[item])
                           } 
                        }  
                       
                       if(this.projectButtons.manager && this.projectButtons.manager.length>0){
                            this.projectButtons.manager = this.projectButtons.manager.slice(1)
                           for(let item in this.projectButtons.manager){
                               this.mergedButtons.push(this.projectButtons.manager[item])
                           }
                        }
                      
                       console.log(this.mergedButtons, "merged");
                       let foundMatch = false;
                        for (let item of this.unreadMessage.Task) {
                            //console.log(Object.values(item), "unreadPro");
                            const values = Object.values(item);
                            for (let i = 0; i < values.length - 1; i++) {
                                //console.log(values[i], "unreadPro")
                                if (values[i] == task.task_id && values[i + 1] == this.$route.params.id) {
                                    this.newMessage = true;
                                    foundMatch = true
                                    console.log("match", values[i], this.newMessage);
                                    break;
                                }else{
                                    this.newMessage = false;
                                    console.log("match", this.newMessage,Object.values(item)[i],task.task_id );
                                }
                                if(foundMatch == true){
                                    break;
                                }
                            }
                            if(foundMatch == true){
                                break;
                            }
                            
                        }
                       /*for (let item in this.unreadMessage.Task) {
                            console.log(this.unreadMessage.Task[item]);
                            const keys = Object.keys(this.unreadMessage.Task[item]);
                            console.log(keys, "object.keys(this.unreadMessage.Task[item])");
                        
                            if (
                                this.unreadMessage.Task[item][keys[0]] === task.task_id &&
                                this.unreadMessage.Task[item][keys[1]] == this.$route.params.id
                            ) {
                                this.newMessage = true;
                                console.log("match", this.newMessage);
                            } else {
                                this.newMessage = false;
                                console.log("something went wrong",  this.$route.params.id);
                            }
                        }*/
                       /*for (let item of this.unreadMessage.Task) {
                            console.log(item);
                            const keys = Object.keys(item);
                            console.log(keys, "object.keys(item)")
                            for (let key of keys) {
                                if (this.unreadMessage.Task[item][keys[0]] == task.task_id && this.unreadMessage.Task[item][keys[1]] == this.$route.params.id) {
                                    this.newMessage = true;
                                    console.log("match", this.newMessage);
                                }else{
                                    console.log("something went wrong", this.unreadMessage.Task[item][keys[0]])
                                }
                            }
                        }*/
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
                
                let url=`/api/get-status/${this.$route.params.id}/${statusData.data.task_id}`;

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
                dataTravel.projectId =this.$route.params.id;
                dataTravel.taskId = this.ActualTaskData.task_id;
                dataTravel.StatusId= set.data.id;
                dataTravel.priorityId = set.priority.id;
                dataTravel.setAllTask = set.setAllTask;
                dataTravel.setAllPriority = set.setAllPriority;

                let url='/api/set-status';
                ServiceClient.post(url,dataTravel).then((response) =>{
                    if (response.status == 200){
                        console.log(response.data, "responseDATA")
                        this.message = response.data.message;
                        
                        this.show_popup = true;
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
            },
            getFilterData(){
                let Task=true;
                let url=`/api/get-status/${this.$route.params.id}/${Task}`;

                ServiceClient.post(url).then((response) =>{
                    if (response.status == 200){
                        //console.log(response.data, "responseDATA")
                        for(let item in response.data){
                            this.statusDataTravel= response.data[item].status.map(u=>({id:u.id, name:u.task_status}))
                        }
                        
                        
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
                //console.log(this.setFilterData, "SORTDA")

            },
            clearFilter(){
                this.setFilterData=[]
                this.getTasks();
                //console.log(this.setFilterData, "SORTDA")
            },
            Completed(emit){
                const{data}=emit;
                this.loader = true;
                let dataTravel={};
                dataTravel.projectId = this.$route.params.id
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
                            this.getTasks();
                        },  1500)
                        
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
              
                console.log(this.setSortData, "SORTDA")
                this.getTasks()
         


            },
            clearSort(clearKey){
               
                for(let e in this.setSortData){
                    if(this.setSortData[e].key === clearKey.key){
                        const index = this.setSortData.indexOf(this.setSortData[e]);
                        this.setSortData.splice(index, 1);
                    }
                }
                console.log(this.setSortData, "SORTDA")
                this.getTasks()

            },
            getUnreadMessages(){
                ServiceClient.post('/api/get-unread-messages').then(response => {
                    console.log("getUnreadMessages",response.data);
                   // store.commit("getUnreadMessages", response.data);
                    this.unreadMessage = response.data
                }).catch(error =>{
                    console.log(error);
                });
            },
            ShoudShowEnvelope(task){
                let foundMatch = false;
                if(this.unreadMessage && this.unreadMessage !== undefined){
                    for (let item of this.unreadMessage.Task) {
                        //console.log(Object.values(item), "unreadPro");
                        const values = Object.values(item);
                        for (let i = 0; i < values.length - 1; i++) {
                            //console.log(values[i], "unreadPro")
                            if (values[i] == task.task_id && values[i + 1] == this.$route.params.id) {
                               // console.log(values);
                                return foundMatch = true
                            
                            }else{
                                foundMatch = false;;
                               // console.log("match", this.newMessage,Object.values(item)[i],task.task_id );
                            }
                            
                        }
                        
                        
                    
                    }
                   
                }
              
                    
                    
                
                
            },


            
        },
        beforeMount(){
            this.getUnreadMessages();
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
        <ErrorPopup v-if="show_error_popup==true" :message="this.message" :errorarray="this.errorArray"></ErrorPopup>
    </Transition>
    <Transition name="drop">
        <AreYouSureModal v-if="show_areyousure_popup==true"></AreYouSureModal>
    </Transition>
    
    <div class="content-container">
        
    
        <div class="centerd-component-container" >
            <div class="content-title task" >
            <h1>{{projectData.name}}</h1>
            <h2>{{ projectData.manager }}</h2>
            </div>
            <div class="scrolling-table-container">
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
                            <button v-if="this.managerRole==true || this.adminRole==true || this.participantRole==true" class="ui right floated small primary labeled icon button" @click="showCreateTaskModal()"><i class="tasks icon"></i>New Task</button></th>
                            
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

                        <tr v-for="task in taskData" :key="task.task_id" :class="rowBackground(task)">
                            <td>{{ task.task_id }}</td>
                            <td>{{task.task_name }}</td>
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
    :taskData="this.taskDataTravel"
    :Participants="this.getActiveTaskEmployee"
    :projectId ="this.$route.params.id"
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
    
  
</style>