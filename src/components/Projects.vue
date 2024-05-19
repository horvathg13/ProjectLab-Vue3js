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
  import AreYouSureModal from './Modals/AreYouSureModal.vue';
  import Loader from './Common/Loading.vue';
  import EventHandler from "@/components/Common/EventHandler/eventHandler.vue";
  export default {
    components: {
      EventHandler,
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
        AreYouSureModal,
        Loader
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
            userRole:[],
            errorArray:[],
            setSortData:[],
            setFilterData:[],
            removeData:[],
            triggerModal:false,
            triggerValue:null,
            dataSave:[],
            tryAgain:null,
            getmanager:[],
            serverError:''
        }
    },
    watch: {
        '$store.state.unreadMessages'(newValue) {
            this.unreadMessage = newValue;
        },
        
        '$store.state.userRole'(newValue) {
            this.userRole = newValue;
        }
    },

    computed:{
        SetAddNewUser(){
            const isAdmin= this.userRole ? this.userRole.some(item=>item.role === "Admin") :false
            return isAdmin
        }
    },
    methods:{
        triggerfunction(data){
            const{trigger} = data
            this.triggerValue = trigger
            
            if(this.triggerValue === true){
                if(this.func === 'leaveProject'){
                    this.leaveProject();
                }
            }else if(this.triggerValue===false){
                this.triggerModal=false;
                this.triggerValue=null;
            }
        },
        updateModal(){
            this.Editdata = null
            if(this.showModal==false){
                this.showModal = true
            }
        },

        showParticipantModal(project){
          ServiceClient.getProjectParticipants(project.project_id).then(participants=>{
            this.participants = participants
            this.projectData = project
            let newUsers=this.getusers.filter((e)=> {
              return !this.participants.some(participant => participant.userId === e.id);
            });
            this.getusers=newUsers
            if(this.show_participant_modal === false){
              this.show_participant_modal = true
            }
          }).catch((error) => {
            if (error.response.data && error.response.data.message) {
              this.message= error.response.data.message
              this.show_error_popup = true
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
            this.closeErrorModal()
            const { p_name, manager, date, p_id } = data;
            this.tryAgain=true

            ServiceClient.createProject(p_name,manager,date,p_id).then(success=>{
              this.show_popup = true
              setTimeout(() => {
                this.show_popup = false
                this.cancelModal();
                this.getProjects();
                this.message = "";
              },  1500)
            }).catch(error=>{
              this.serverError=error
              this.tryAgain=false
              this.show_error_popup=true
            })
        },
        getProjects(){
            this.loader=true;

            ServiceClient.getProjects(this.setSortData, this.setFilterData).then(projects=>{
              this.getprojects=projects
              this.loader=false;
            }).catch((error) => {
              if (error.response.data && error.response.data.message) {
                this.message= error.response.data.message
                this.show_error_popup = true
                this.loader=false;
              }
            });
        },

        getManagers(){
            ServiceClient.getManagers().then(managers=>{
              this.getmanager=managers
            }).catch((error) => {
              if (error.response.data && error.response.data.message) {
                this.show_error_popup = true
              }
            });
        },
        getUsers(project){
          ServiceClient.getEmployees().then(employees=>{
            this.getusers=employees
            this.showParticipantModal(project)
            this.projectData=project
          }).catch((error) => {
            if (error.response.data && error.response.data.message) {
              this.serverError=error
              this.show_error_popup = true
            }
          });
        },
            
        redirect(project){
            this.projectData = project
            this.redirectToTasks = true;
            this.$router.push({
              name:"Tasks",
              params:{
                id: project.project_id
              }
            })
        },
        createParticipants(data){
            this.closeErrorModal()
            this.participants=[];
            this.tryAgain=true;
            const { selected, remove_employee } = data;
            ServiceClient.createProjectParticipants(selected.select, this.projectData, remove_employee).then(success=>{
              this.message = success.message;
              this.show_popup = true;
              this.tryAgain=false
              this.showParticipantModal(this.projectData)
              setTimeout(() => {
                this.show_popup = false;
                this.message = "";
              }, 1500);

            }).catch((error) => {
                this.serverError=error
                this.show_error_popup=true
                this.tryAgain=false
              this.showParticipantModal(this.projectData)
            });
            this.getUsers(this.projectData)

        },
        EditingModeSwitch(project){
            const {data, switching} = project
            this.Editdata = project.data
            this.EditMode = project.switching;
            this.showModal = true
        },
        commentModalSwitch(project){
            const {data} = project;
            this.projectData = project.data
            ServiceClient.getProjectParticipants(this.projectData.project_id).then((participants)=>{
              this.projectParticipants=participants
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
          ServiceClient.sendMessage(message,this.projectData.project_id,null).then(response=>{
            this.tryAgain=false
          }).catch(error=>{
            this.tryAgain=false
            this.serverError=error
            this.show_error_popup=true
          })
        },
        getButtons(project){
            this.projectData = project
            this.mergedButtons=[];
            ServiceClient.buttonAuth(project.project_id).then((rights)=>{
              let isHaveGlobalManagerRole= store.state.userRole.some(i=>i.role==="Manager");
              let isHaveGlobalAdminRole=store.state.userRole.some(i=>i.role==='Admin');
              let isHaveGlobalEmployeeRole=store.state.userRole.some(i=>i.role==="Employee");

              if(isHaveGlobalManagerRole && rights.manager || isHaveGlobalAdminRole){
                this.mergedButtons.push(...store.state.PROJECT.MANAGERBUTTONS)
              }
              if(isHaveGlobalEmployeeRole && rights.employee && !isHaveGlobalAdminRole){
                this.mergedButtons.push(...store.state.PROJECT.EMPLOYEEBUTTONS)
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
            ServiceClient.getStatus(statusData.data.project_id, null).then(statuses=>{
              this.statusDataTravel= statuses
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

            if(set.data === ""){
              this.message='Operation Canceled.'
              this.show_error_popup = true
              setTimeout(()=>{this.tryAgain = false},1000)

            }else {

              ServiceClient.setStatus(this.projectData.project_id, null, data, null).then(() => {
                this.getProjects();
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
            }
        },
        getFilterData(){
            ServiceClient.getStatus(null, null).then(statuses=>{
              this.statusDataTravel= statuses.map((u)=>({id: u.id, name: u.p_status}))
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
            this.getProjects();
        },
        clearFilter(){
            this.setFilterData=[];
            this.getProjects();
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
            this.getProjects();
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
            this.unreadMessage = this.$store.state.unreadMessages
        },
        favoriteStar(project){
            this.loader=true

            let dataTravel={};
            dataTravel.project= project
            let url = ''
            if(project.favorite==true){
              ServiceClient.removeFromFavoriteProject(project).then(success=>{
                this.show_popup = true
                setTimeout(() => {
                  this.show_popup = false
                  this.getProjects()
                },  1500)
              }).catch(error=>{
                this.serverError=error
                this.show_error_popup=true
              })
            }else{
              ServiceClient.setFavoriteProject(project).then(success=>{
                this.show_popup = true
                setTimeout(() => {
                  this.show_popup = false
                  this.getProjects()
                },  1500)
              }).catch(error=>{
                this.serverError=error
                this.show_error_popup=true
              })
            }
        },
        DataSave(project){
            const {data, str} = project
            this.dataSave = data;
            this.func = str
            this.triggerModal= true
        },
        leaveProject(){
            this.closeErrorModal()
            this.triggerModal=false;
            ServiceClient.leaveProject(this.dataSave.project_id).then((success)=>{
              this.message =success.message
              this.show_popup = true
              setTimeout(() => {
                this.show_popup = false
                this.message = ""
                this.getProjects();
              },  1500)
            }).catch(error =>{
              this.serverError=error
              this.show_error_popup=true
            })
        },
        setUserRoles(){
            this.userRole = this.$store.state.userRole
        },
        closeErrorModal(){
          this.show_error_popup=false
          this.serverError=[]
          this.message=''
          this.errorArray=[]
        }
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
        this.setUserRoles()
    },
    mounted(){
        this.getProjects()
        this.getManagers();
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

        <div class="content-container"> 
            
            <div class="centerd-component-container">
                
                <div class="scrolling-table-container">
                    <Loader v-if="loader===true"></Loader>
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
                                <th>
                                <button v-if="SetAddNewUser" class="ui small primary labeled icon button" @click="updateModal"><i class="folder open icon"></i>Add</button></th>
                                
                            </tr>
                        </thead>
                        <tbody >
                            <tr v-for="project in getprojects" :key="project.id" :class="rowBackground(project)">
                                <td>{{project.project_id}}</td>
                                <td :style="{overflow:'hidden', textOverflow:'ellipsis'}">{{project.manager}}</td>
                                <td :style="{overflow:'hidden', textOverflow:'ellipsis'}">{{project.name}}</td>
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
                                        @redirect="this.redirect(project)"
                                        @showParticipantModal="this.getUsers(project)"
                                        @edit="this.EditingModeSwitch"
                                        @CommentEmit="this.commentModalSwitch"
                                        @SwitchModal="SwitchStatusModal"
                                        @DataSaveLeaveProjectEmit="DataSave">
                                    </CircularMenu>
                                </td>
                                <td>
                                    <button class="ui icon button" @click="favoriteStar(project)">
                                        <i v-if="project.favorite === true" class="yellow star icon"></i>
                                        <i v-else class="star outline icon"></i>
                                    </button>
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
                <CreateProjectModal v-if="showModal==true" 
                @cancel-modal="cancelModal"
                @create-project="createProjects" 
                :getusers="this.getmanager" 
                :isDropdownOpen="this.isDropdownOpen"
                :EditMode="this.EditMode"
                :EditData="this.Editdata"
                :tryAgain="this.tryAgain"></CreateProjectModal>
        </Transition>
        <Transition>
            <AddProjectParticipantsModal v-if="show_participant_modal == true"
            @cancel-modal="cancelModal"  
            @add-participants="createParticipants"
            :getusers="this.getusers"
            :projectData="this.projectData"
            :participants = this.participants
            :tryAgain="this.tryAgain"></AddProjectParticipantsModal>
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
        :tryAgain="this.tryAgain"
        @set-status="SetStatus"></Status>
        <AreYouSureModal v-if="triggerModal==true" @trigger="triggerfunction"></AreYouSureModal>
    </div>
</template>

<style scoped>

</style>
