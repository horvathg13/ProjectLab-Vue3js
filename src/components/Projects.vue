<script>
  import CreateProjectModal from './Modals/CreateProjectModal.vue';
  import ServiceClient from '../ServiceClient';
  import Success_Popup from './Common/Success_Popup.vue';
  import ErrorPopup from './Common/ErrorPopup.vue';
  import ProjectTasks from './ProjectTasks.vue';
  import AddProjectParticipantsModal from './Modals/AddProjectParticipantsModal.vue';
  import AccrodionMenu from './Common/AccordionMenu.vue';
  import ContentTitle from './Common/ContentTitle.vue';
  import CircularMenu from './Common/CircularMenu.vue';
  import CommentModal from './Modals/CommentModal.vue'

  export default {
    components: {
        CreateProjectModal,
        Success_Popup,
        ErrorPopup,
        ProjectTasks,
        AddProjectParticipantsModal,
        AccrodionMenu,
        ContentTitle,
        CircularMenu,
        CommentModal,
    },

    data() {
        return {
            showModal:false,
            show_popup:false,
            show_error_popup:false,
            redirectToTasks:false,
            p_name:"",
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
        }
    },
   
    methods:{
        updateModal(){
            
            if(this.showModal==false){
                this.showModal = true
            }
            
        },

        showParticipantModal(project){
            const{data} = project
            if(this.show_participant_modal==false){
                this.show_participant_modal = true
            }
            this.projectData = [project.data]
            console.log("parti",  this.projectData)
        },

        cancelModal(){
            this.showModal = false
            this.show_participant_modal = false
            this.EditMode = false
            this.show_Comment_Modal = false
            
        },

        createProjects(data){
            
            const { p_name, manager, date } = data;
            
            this.p_name = p_name ;
            this.selectedManager = manager;
            this.date = date;
            
            console.log(this.selectedManager, this.date, p_name)
            
            let formData = new FormData();
            formData.append("p_name", this.p_name);
            formData.append("p_manager_id", this.selectedManager.id);
            formData.append("date",this.date);
            let url ="http://127.0.0.1:8000/api/createproject";
                ServiceClient.post(url,formData).then((response) =>{
                    console.log(response);
                    if (response.status == 200){

                        this.message= response.data.message
                        this.show_popup = true
                        setTimeout(() => {
                            this.show_popup = false
                            this.cancelModal()
                        },  1500)
                        console.log(response)
                    }
                }).catch((error) => {
                        
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.message= Object.values(error.response.data.message).flatMap(y => y)
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                            },  2000)
                            
                        }
                    }
                });
            
        },
                   

            getProjects(){
                let url ="http://127.0.0.1:8000/api/getprojects";
                ServiceClient.post(url).then((response) =>{
                        
                        if (response.status == 200){
                            
                            this.getprojects=response.data
                            
                        }
                    }).catch((error) => {
                            
                        if (error.response && error.response.status) {
                            if (error.response.data && error.response.data.message) {
                                this.message= error.response.data.message
                                this.show_error_popup = true
                                setTimeout(() => {
                                    this.show_error_popup = false
                                },  4500)
                                
                            }
                        }
                    });
            },

            getUsers(){
                let url ="http://127.0.0.1:8000/api/getusers";
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
            
            redirect(project){
                const {data} = project.data;
                this.projectData = [project]
                console.log(this.projectData,"érik a szőlő")
                this.redirectToTasks = true;
                this.$router.push(`/projects/${project.data.project_id}/tasks`);
                
            },

            createParticipants(data) {
                const { select } = data;
                this.participants = data.selected.select;
               

                for (let parti in this.participants) {
                    for (let pro in this.projectData) {
                    this.mergeData= {
                        ...this.participants[parti],
                        ...this.projectData[pro],
                    };

                    this.finalData.push(this.mergeData);
                }}
                    console.log(JSON.stringify(this.finalData), "hullapelyhes");

                    let formData = new FormData();
                    formData.append("datas", JSON.stringify(this.finalData));
                    let url = "http://127.0.0.1:8000/api/createparticipants";
                    ServiceClient.post(url, formData)
                        .then((response) => {
                        if (response.status == 200) {
                            this.message = response.data.message;
                            this.show_popup = true;
                            this.finalData= [];
                            setTimeout(() => {
                            this.show_popup = false;
                            this.cancelModal();
                            }, 1500);
                            console.log(response);
                        }
                        })
                        .catch((error) => {
                        if (error.response && error.response.status) {
                            if (error.response.data && error.response.data.message) {
                            this.message = Object.values(error.response.data.message).flatMap(
                                (y) => y
                            );
                            this.show_error_popup = true;
                            setTimeout(() => {
                                this.show_error_popup = false;
                            }, 2000);
                            }
                        } else {
                            this.message = "Error occurred during the request";
                            this.show_error_popup = true;
                            setTimeout(() => {
                            this.show_error_popup = false;
                            }, 2000);
                        }
                        });
                    },
                    contentTitle(){
                        this.h1= this.$route.name
                    },
                    circularMenuDropdown(){
                        this.circulardrop = !this.circulardrop
                        console.log("circular drop")
                    },
                    EditingModeSwitch(kiskutya){
                        const {data, switching} = kiskutya
                        this.Editdata = kiskutya.data
                        this.EditMode = kiskutya.switching;
                        console.log(this.Editdata, "editmode")
                        this.showModal = true
                    },
                    commentModalSwitch(kismacska){
                        const {data} = kismacska;
                        console.log(kismacska);
                        this.projectData = kismacska.data
                        console.log(this.projectData, "kismacsadata")
                        let url =`http://127.0.0.1:8000/api/getprojectparticipants/${this.projectData.project_id}`;
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
                                   
                                    console.log(this.projectParticipants, "rókagomba")
                                    this.show_Comment_Modal = true
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
                    SendMessage(emitData){
                        const{participants,message,data} = emitData
                        let projectId = this.projectData.project_id;

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
                                        this.message =error.response.data.message
                                        console.log(this.message, "errormessage")
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
            this.getProjects()
            this.getUsers()
            this.contentTitle();
            
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
            <ErrorPopup v-if="show_error_popup==true" :message="this.message"></ErrorPopup>
        </Transition>
        <Transition name="drop">
            <AreYouSureModal v-if="show_areyousure_popup==true"></AreYouSureModal>
        </Transition>
        <div class="content-container"> 
            
            <!--<div class="content-title">
                <h1>Projects</h1>
            </div>-->
            <div class="centerd-component-container">
                
                <div class="scrolling-table-container">
                    <table class="ui selectable striped table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Manager</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Deadline</th>
                                <th>
                                <button class="ui right floated small primary labeled icon button" @click="updateModal"><i class="folder open icon"></i>Add</button></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="project in getprojects" :key="project.id">
                                <td>{{project.project_id}}</td>
                                <td>{{project.manager}}</td>
                                <td>{{project.name}}</td>
                                <td>{{ project.status}}</td>
                                <td>{{ project.deadline}}</td>
                                <td>
                                    <!--<button class="ui small violet button"><i class="edit icon"></i>Edit</button>-->
                                    
                                    <!--<button class="circular ui scrolling dropdown blue icon button" @click="circularMenuDropdown">
                                        <i class="ellipsis horizontal icon"></i>
                                        <div class="right menu"  :class="{active: this.circulardrop}">
                                            <div class="item"><button class="ui small orange button" @click="redirect(project)"><i class="tasks icon"></i>View Tasks</button></div>
                                            <div class="item"><button class="ui small green button" @click="showParticipantModal(project)"><i class="user plus icon"></i>Employees</button></div>

                                        </div>
                                    </button>-->
                                    <CircularMenu
                                        :data="project"
                                        :component="this.$route.name"
                                        @redirect="this.redirect"
                                        @showParticipantModal="this.showParticipantModal"
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
                <CreateProjectModal v-if="showModal==true" 
                @cancel-modal="cancelModal" 
                
                @create-project="createProjects" 
                :getusers="this.getusers" 
                :isDropdownOpen="this.isDropdownOpen"
                :EditMode="this.EditMode"
                :EditData="this.Editdata"></CreateProjectModal>
        </Transition>
        <ProjectTasks v-if="redirectToTasks==true"
        :projectData="this.projectData"></ProjectTasks>
        <Transition>
            <AddProjectParticipantsModal v-if="show_participant_modal == true"
            @cancel-modal="cancelModal"  
            @create-participants="createParticipants"
            :getusers="this.getusers"
            :projectData="this.projectData"></AddProjectParticipantsModal>
        </Transition>
        <CommentModal v-if="this.show_Comment_Modal == true"
        @cancel-modal="cancelModal"
        @sendEmit="SendMessage"
        :Participants="this.projectParticipants"
        :projectData="this.projectData" ></CommentModal>
    </div>
</template>

<style scoped>

</style>
