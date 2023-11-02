<script>
  import CreateProjectModal from './Modals/CreateProjectModal.vue';
  import ServiceClient from '../ServiceClient';
  import Success_Popup from './Common/Success_Popup.vue';
  import ErrorPopup from './Common/ErrorPopup.vue';
  import ProjectTasks from './ProjectTasks.vue';
  import AddProjectParticipantsModal from './Modals/AddProjectParticipantsModal.vue';
  import ContentTitle from './Common/ContentTitle.vue';
  import CircularMenu from './Common/CircularMenu.vue';
  import CommentModal from './Modals/CommentModal.vue';
  import {store} from "../VuexStore";
  import Status from './Modals/Status.vue'
  import Filter from './Common/FilterButton.vue'
  import Sort from './Common/SortButton.vue'
  import Loader from './Common/Loading.vue'

  export default {
    components: {
        CreateProjectModal,
        Success_Popup,
        ErrorPopup,
        ProjectTasks,
        AddProjectParticipantsModal,
        ContentTitle,
        CircularMenu,
        CommentModal,
        Status,
        Filter,
        Sort,
        Loader,
    },

    data() {
        return {
            showModal:false,
            show_popup:false,
            show_error_popup:false,
            redirectToTasks:false,
            p_name:"",
            p_id:null,
            selectedManager:{},
            date:"",
            getprojects:Array,
            getusers:Array,
            trigger: null,
            projectData:Array,
            show_participant_modal:false,
            message:"",
            participants:[],
            finalData:[],
            mergeData:{},
            h1:"",
            circulardrop:false,
            EditMode:false,
            Editdata:[],
            show_Comment_Modal:false,
            projectParticipants:Array,
            unreadMessage:{},
            projectButtons:{},
            mergedButtons:[],
            newMessage:false,
            showStatusModal:false,
            statusDataTravel:[],
            loader:false,
            AddNewProject:false,
            userRole:{},
            errorArray:[],
            setSortData:[],
            setFilterData:[],
            removeData:[],
            tryAgain:null,
            getmanager:[],
        }
    },
    watch: {
        '$store.state.unreadMessages'(newValue) {
            this.unreadMessage = newValue;
        },
        
        '$store.state.userRole'(newValue) {
            this.userRole = newValue;
            this.SetAddNewUser()
        }
    },

    computed:{
       
    },
    methods:{
            SetAddNewUser(){
                if(this.userRole.code !== 404){
                    const isAdmin= this.userRole.some(item=>item.role === "Admin");
                    
                    if(isAdmin == true){
                        this.AddNewProject=true
                    }
                }else{
                    this.$router.push("/accessdenied")
                }
            },
        
            updateModal(){
                this.Editdata = null
                if(this.showModal==false){
                    this.showModal = true
                }
                
            },

            showParticipantModal(project){
                let url =`/api/getprojectparticipants/${project.project_id}`;
                ServiceClient.post(url).then((response) =>{
                    if(response.status == 200){
                        this.participants = response.data
                        
                    }
                    if(this.show_participant_modal==false){
                        this.show_participant_modal = true
                    }
                    this.projectData = project

                }).catch((error) => {
                    if(error.response.data.validatorError){
                        this.errorArray=error.response.data.validatorError
                        this.show_error_popup=true
                        if(this.show_participant_modal==false){
                            this.show_participant_modal = true
                        }
                        setTimeout(() => {
                            this.show_error_popup = false
                            this.errorArray=[];
                            this.cancelModal()
                        },  2000)
                    }
                    if (error.response.data && error.response.data.message) {
                        this.message= error.response.data.message//Object.values(error.response.data.message).flatMap(y => y)
                        this.show_error_popup = true
                        if(this.show_participant_modal==false){
                            this.show_participant_modal = true
                        }
                        setTimeout(() => {
                            this.show_error_popup = false
                            this.message = "";
                        },  2000)
                    }
                });
            },

            cancelModal(){
                this.showModal = false
                this.show_participant_modal = false
                this.EditMode = false
                this.show_Comment_Modal = false
                this.projectButtons = {},
                this.mergedButtons = [],
                this.showStatusModal = false
            },

            createProjects(data){

                const { p_name, manager, date, p_id } = data;
            
                this.p_name = p_name ;
                this.selectedManager = manager;
                this.date = date;
                this.p_id = p_id;
                
                let dataTravel= {};
                dataTravel.project_name= this.p_name
                dataTravel.manager_id= this.selectedManager.id
                dataTravel.date= this.date
                dataTravel.project_id= this.p_id
                let url ="/api/createproject";
                ServiceClient.post(url,dataTravel).then((response) =>{
                    if (response.status == 200){
                        this.message= response.data.message
                        this.show_popup = true
                        this.getFavoriteProjects();
                        setTimeout(() => {
                            this.show_popup = false
                            this.cancelModal()
                            this.message = "";
                        },  1500)
                    }
                }).catch((error) => {
                    this.tryAgain=null;     
                    if (error.response && error.response.status) {
                        if(error.response.data.validatorError){
                                this.errorArray=error.response.data.validatorError
                                this.show_error_popup=true
                                setTimeout(() => {
                                    this.show_error_popup = false
                                    this.errorArray=[];
                                    this.tryAgain=false;
                                },  2000)
                            }
                        if (error.response.data && error.response.data.message) {
                            this.message= error.response.data.message//Object.values(error.response.data.message).flatMap(y => y)
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                                this.message = "";
                                this.tryAgain=false;
                            },  2000)
                        }
                    }
                });
                this.getFavoriteProjects();
            },
                   

            getFavoriteProjects(){
                this.loader=true;
                let url ="/api/get-favorite-projects";
                let dataTravel={};
                dataTravel.sortData = this.setSortData,
                dataTravel.filterData=this.setFilterData
                ServiceClient.post(url,dataTravel).then((response) =>{
                        
                    if (response.status == 200){
                        
                        this.getprojects=response.data
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
            getManagers(){
                let url ="/api/getManagers";
                ServiceClient.post(url).then((response) =>{
                    if (response.status == 200){
                        this.getmanager=response.data
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

            getUsers(project){
                let url ="/api/getEmployees";
                let dataTravel={}
                dataTravel.projectId = project.project_id
                ServiceClient.post(url,dataTravel).then((response) =>{
                    if (response.status == 200){
                        this.getusers=response.data
                        this.showParticipantModal(project)
                    }
                }).catch((error) => {
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                            },  3500)
                        }
                    }
                });
            },
            
            redirect(project){
                const {data} = project.data;
                this.projectData = [project]
                this.redirectToTasks = true;
                this.$router.push(`/projects/${project.data.project_id}/tasks`);
                
            },

            createParticipants(data){
                const { selected, remove_employee } = data;
                this.participants = data.selected.select;
                this.removeData = data.remove_employee
               
                const finalData={};
                finalData.participants = this.participants;
                finalData.project = this.projectData;
                finalData.remove = this.removeData

                
                let url = "/api/createparticipants";
                ServiceClient.post(url, finalData)
                    .then((response) => {
                    if (response.status == 200) {
                        this.message = response.data.message;
                        this.show_popup = true;
                        this.finalData= [];
                        setTimeout(() => {
                            this.show_popup = false;
                            this.cancelModal();
                            this.message = "";
                        }, 1500);
                    }
                }).catch((error) => {
                    if (error.response && error.response.status) {
                        if(error.response.data.validatorError){
                            this.errorArray=error.response.data.validatorError
                            this.show_error_popup=true
                            setTimeout(() => {
                                this.show_error_popup = false
                                this.errorArray=[];
                                this.cancelModal();
                            },  2000)
                        }
                        if (error.response.data && error.response.data.message) {
                            this.message=error.response.data.message
                            this.show_error_popup = true;
                            setTimeout(() => {
                                this.show_error_popup = false;
                                this.cancelModal();
                                this.message = "";
                            }, 2000);
                        }
                    } else {
                        this.message = "Error occurred during the request";
                        this.show_error_popup = true;
                        setTimeout(() => {
                        this.show_error_popup = false;
                        this.message = "";
                        }, 2000);
                    }
                });
            },
            contentTitle(){
                this.h1= this.$route.name
            },
            circularMenuDropdown(){
                this.circulardrop = !this.circulardrop
            },
            EditingModeSwitch(kiskutya){
                const {data, switching} = kiskutya
                this.Editdata = kiskutya.data
                this.EditMode = kiskutya.switching;
                this.showModal = true
            },
            commentModalSwitch(kismacska){
                const {data} = kismacska;
                this.projectData = kismacska.data
                let url =`/api/getprojectparticipants/${this.projectData.project_id}`;
                ServiceClient.post(url).then((response) =>{
                    if (response.status == 200){
                        this.projectParticipants=[]
                        for(let data of response.data){
                            this.projectParticipants.push({
                                id:data.userId,
                                name:data.name,
                                email:data.email,
                                project_name:data.project_name,
                                status:data.status
                            })
                        }
                        this.show_Comment_Modal = true
                    }
                }).catch((error) => {
                        
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.message = error.response.data.message
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                                this.message = ""
                            },  4500)
                            
                        }
                    }
                });
                
            },
            SendMessage(emitData){
                const{participants,message,data} = emitData
                
                emitData.projectId=this.projectData.project_id;
                let url='/api/send-message';
                ServiceClient.post(url, emitData).then((response) =>{
                        if (response.status == 200){
                            this.show_popup=true
                            setTimeout(() => {
                            this.show_popup = false
                            this.cancelModal()
                            },  1500)
                        }
                }).catch((error) => {
                    this.tryAgain=null;
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.message =error.response.data.message
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
            getButtons(project){
                this.projectData = project
                let url=`/api/get-buttons/${project.project_id}`
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
                                }else if(item=="admin"){
                                    this.projectButtons.admin= response.data[i][item]
                                }
                            }
                        }
                        
                        if(this.projectButtons.employee && this.projectButtons.employee.length>0){
                            this.projectButtons.employee = this.projectButtons.employee.slice(0,2)
                            for(let item in this.projectButtons.employee){
                                this.mergedButtons.push(this.projectButtons.employee[item])
                            } 
                            
                        }
                        if(this.projectButtons.admin && this.projectButtons.admin.length>0){
                            this.projectButtons.admin = this.projectButtons.admin.slice(3,8)
                            for(let item in this.projectButtons.admin){
                                this.mergedButtons.push(this.projectButtons.admin[item])
                            }
                        
                            
                        }
                        if(this.projectButtons.manager && this.projectButtons.manager.length>0){
                            this.mergedButtons.push(this.projectButtons.manager[0])
                            this.projectButtons.manager=this.projectButtons.manager.slice(2)
                            for(let item in this.projectButtons.manager){
                                this.mergedButtons.push(this.projectButtons.manager[item])
                            }
                            
                        }    
                        
                        let foundMatch=false
                        for (let item of this.unreadMessage.Project) {
                            for(let i in Object.values(item)){
                                if(Object.values(item)[i] == project.project_id){
                                    this.newMessage = true;
                                    foundMatch=true
                                    break;
                                }else{
                                    this.newMessage = false;
                                }
                                if(foundMatch==true){
                                    break;
                                }
                            }
                            if(foundMatch==true){
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
                let TaskId=null
                let url=`/api/get-status/${statusData.data.project_id}/${TaskId}`;

                ServiceClient.post(url).then((response) =>{
                    if (response.status == 200){
                        for(let item in response.data){
                            this.statusDataTravel= response.data[item]
                        }
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
                let dataTravel={}
                dataTravel.projectId = this.projectData.project_id;
                dataTravel.taskId = null;
                dataTravel.StatusId= set.data.id;
                dataTravel.priorityId = null;
                dataTravel.setAllTask = null;
                dataTravel.setAllPriority = null;
                let url='/api/set-status';
                ServiceClient.post(url,dataTravel).then((response) =>{
                    if (response.status == 200){
                        this.message = response.data.message;
                        this.getFavoriteProjects();
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
                            setTimeout(() => {
                                this.show_error_popup = false
                                this.message = ""
                            }, 2000)

                        }
                    }
                });
            },
            getFilterData(){
                let TaskId=null;
                let ProjectId = null;
                let url=`/api/get-status/${ProjectId}/${TaskId}`;

                ServiceClient.post(url).then((response) =>{
                    if (response.status == 200){
                        for(let item in response.data){
                            this.statusDataTravel= response.data[item].status.map(u=>({id:u.id, name:u.p_status}))
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
            filter(selectData){
                const{select}=selectData
                for(let e in this.setFilterData){
                    if(this.setFilterData[e].name === selectData.select.name){
                        const index = this.setSortData.indexOf(this.setFilterData[e]);
                        this.setFilterData.splice(index, 1);
                    }
                }
                this.setFilterData.push(selectData.select);
                this.getFavoriteProjects();
            },
            clearFilter(){
                this.setFilterData=[];
                this.getFavoriteProjects();
            },
            rowBackground(project){
                let color = "";
                if(project.status=="Suspended"){
                    color="error"
                }else if(project.status=="Completed"){
                    color="positive"
                }else if(project.status=="Deleted"){
                    color="error"
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
                this.getFavoriteProjects();
            },
            ShoudShowEnvelope(project){
                let foundMatch=false
                if(this.unreadMessage.Project !== undefined){
                    for (let item of this.unreadMessage.Project) {
                        for(let i in Object.values(item)){
                            if(Object.values(item)[i] == project.project_id){
                                
                                foundMatch=true
                                return foundMatch;
                            }else{
                                foundMatch=false
                            }
                            if(foundMatch==true){
                                break;
                            }
                        }
                        if(foundMatch==true){
                            break;
                        }
                    }
                }
            },
            getUnreadMessages(){
                ServiceClient.post('/api/get-unread-messages').then(response => {
                    store.commit("getUnreadMessages", response.data);
                    this.unreadMessage = response.data
                }).catch(error =>{
                    console.log(error);
                });
            }
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
        mounted(){
            this.getUnreadMessages();
            this.getFavoriteProjects()
            //this.getUsers()
            this.contentTitle();
            this.getManagers();
        }
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
            <ErrorPopup v-if="show_error_popup==true" :message="this.message" :errorarray="this.errorArray"></ErrorPopup>
        </Transition>
        <Transition name="drop">
            <AreYouSureModal v-if="show_areyousure_popup==true"></AreYouSureModal>
        </Transition>
        <div class="content-container"> 
            
            <div class="centerd-component-container">
                
                <div class="scrolling-table-container">
                    <Loader v-if="loader==true"></Loader>
                    <table class="ui selectable striped table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Manager</th>
                                <th>Title</th>
                                <th>Status <Filter :data="this.statusDataTravel" @select="filter" @deleteSelected="clearFilter" @click="getFilterData"></Filter></th>
                                <th>Deadline <Sort :data="this.taskData" :sortKey="'deadline'" @sorted="Sort" @deleteSelected="clearFilter"></Sort></th>
                                <th></th>
                                <th></th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="project in this.getprojects" :key="project.id" :class="rowBackground(project)">
                                <td>{{project.project_id}}</td>
                                <td :style="{overflow:'auto', textOverflow:'ellipsis'}">{{project.manager}}</td>
                                <td :style="{overflow:'auto', textOverflow:'ellipsis'}">{{project.name}}</td>
                                <td>{{ project.status}}</td>
                                <td>{{ project.deadline}}</td>
                                <td ><i v-if="ShoudShowEnvelope(project)" class="red envelope icon"></i></td>
                                
                                <td>
                                   
                                    <CircularMenu
                                        @click="getButtons(project)"
                                        :data="project"
                                        :buttons="this.mergedButtons"
                                        :component="this.$route.name"
                                        :newMessage="this.newMessage"
                                        @redirect="this.redirect"
                                        @showParticipantModal="this.getUsers(project)"
                                        @edit="this.EditingModeSwitch"
                                        @CommentEmit="this.commentModalSwitch"
                                        @SwitchModal="SwitchStatusModal">
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
                <CreateProjectModal v-if="showModal==true" 
                @cancel-modal="cancelModal" 
                
                @create-project="createProjects" 
                :getusers="this.getmanager" 
                :isDropdownOpen="this.isDropdownOpen"
                :EditMode="this.EditMode"
                :EditData="this.Editdata"
                :tryAgain="this.tryAgain"></CreateProjectModal>
        </Transition>
        <ProjectTasks v-if="redirectToTasks==true"
        :projectData="this.projectData"></ProjectTasks>
        <Transition>
            <AddProjectParticipantsModal v-if="show_participant_modal == true"
            @cancel-modal="cancelModal"  
            @add-participants="createParticipants"
            :getusers="this.getusers"
            :projectData="this.projectData"
            :participants = this.participants></AddProjectParticipantsModal>
        </Transition>
        <CommentModal v-if="this.show_Comment_Modal == true"
        @cancel-modal="cancelModal"
        @sendEmit="SendMessage"
        :Participants="this.projectParticipants"
        :projectData="this.projectData"
        :tryAgain="this.tryAgain"
        ></CommentModal>
        <Status v-if="this.showStatusModal == true"
        @cancel-modal="cancelModal"
        :data="this.statusDataTravel"
        :task="false"
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
