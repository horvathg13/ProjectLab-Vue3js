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
  import CommentModal from './Modals/CommentModal.vue';
  import {store} from "../VuexStore";
  import Status from './Modals/Status.vue'
  import Filter from './Common/FilterButton.vue'
  import Sort from './Common/SortButton.vue'
  import AreYouSureModal from './Modals/AreYouSureModal.vue';
  import Loader from './Common/Loading.vue';
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
        }
    },
    watch: {
        '$store.state.unreadMessages'(newValue) {
            this.unreadMessage = newValue;
            console.log(this.unreadMessage, "hello from watch");
        },
        
        '$store.state.userRole'(newValue) {
            this.userRole = newValue;
            console.log( this.userRole, "hello from user watcher");
            //this.SetAddNewUser()
        }
    },

    computed:{
        SetAddNewUser(){
            console.log(this.userRole)
            const isAdmin= this.userRole ? this.userRole.some(item=>item.role === "Admin") :false
            console.log(isAdmin);
            return isAdmin
        }
    },
    methods:{
        triggerfunction(data){
            const{trigger} = data
            this.triggerValue = trigger
            console.log(this.triggerValue)
            
            if(this.triggerValue === true){
                if(this.func === 'leaveProject'){
                    this.leaveProject();
                }
            }else if(this.triggerValue===false){
                this.triggerModal=false;
                this.triggerValue=null;
            }
        },
        /*SetAddNewUser(){
            if(this.userRole.code !== 404){
                const isAdmin= this.userRole.some(item=>item.role === "Admin");
                
                if(isAdmin == true){
                    this.AddNewProject=true
                    console.log("CIAO", this.userRole);
                }
            }else{
                this.$router.push("/accessdenied")
            }
            
        },
        /*unreadMessages(){
            this.unreadMessage= store.state.unreadMessages
            console.log(this.unreadMessage, "hello from Vuex")
        },*/

        updateModal(){
            this.Editdata = null
            if(this.showModal==false){
                this.showModal = true
            }
            
        },

        showParticipantModal(project){
            const{data} = project
            let url =`/api/getprojectparticipants/${project.data.project_id}`;
            ServiceClient.post(url).then((response) =>{
                if(response.status == 200){
                    this.participants = response.data
                    
                }
                if(this.show_participant_modal==false){
                    this.show_participant_modal = true
                }
                this.projectData = project.data
                console.log("parti", project, this.participant)

            }).catch((error) => {
                if (error.response && error.response.status) {
                    if(error.response.data.validatorError){
                        this.errorArray=error.response.data.validatorError
                        console.log( this.errorArray)
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
                        setTimeout(() => {
                            this.show_error_popup = false
                            this.message = "";
                        },  2000)
                        
                    }
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
            console.log(this.selectedManager, this.date, p_name)
            
            let formData = new FormData();
            formData.append("p_name", this.p_name);
            formData.append("p_manager_id", this.selectedManager.id);
            formData.append("date",this.date);
            formData.append("p_id",this.p_id);
            let url ="/api/createproject";
            ServiceClient.post(url,formData).then((response) =>{
                console.log(response);
                if (response.status == 200){

                    this.message= response.data.message
                    this.show_popup = true
                    setTimeout(() => {
                        this.show_popup = false
                        this.cancelModal();
                        this.getProjects();
                        this.message = "";
                    },  1500)
                    console.log(response)
                }
            }).catch((error) => {
                this.tryAgain=null;    
                if (error.response && error.response.status) {
                    if(error.response.data.validatorError){
                            this.errorArray=error.response.data.validatorError
                            console.log( this.errorArray)
                            this.show_error_popup=true
                            setTimeout(() => {
                                this.show_error_popup = false
                                this.errorArray=[];
                                this.cancelModal()
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
            
        },
                   

        getProjects(){
            this.loader=true;
            let url ="/api/getprojects";
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

        getUsers(){
            let url ="/api/getManagers";
            ServiceClient.post(url).then((response) =>{
                    if (response.status == 200){
                        console.log(response.data, "HERE MANAGERS");
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

        createParticipants(data){
            const { selected, remove_employee } = data;
            //console.log(data, "DATAAA")
            this.participants = data.selected.select;
            this.removeData = data.remove_employee
            console.log(this.participants,this.removeData, "partiparti")
            
            const finalData={};
            finalData.participants = this.participants;
            finalData.project = this.projectData;
            finalData.remove = this.removeData
            console.log(finalData, "hullapelyhes");

            
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
                    console.log(response);
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
                            this.cancelModal();
                        },  2000)
                    }
                    if (error.response.data && error.response.data.message) {
                        this.message=error.response.data.message
                    /*this.message = Object.values(error.response.data.message).flatMap(
                        (y) => y
                    );*/
                    this.show_error_popup = true;
                    setTimeout(() => {
                        this.show_error_popup = false;
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
       
        circularMenuDropdown(){
            this.circulardrop = !this.circulardrop
            //console.log("circular drop")
        },
        EditingModeSwitch(kiskutya){
            const {data, switching} = kiskutya
            this.Editdata = kiskutya.data
            this.EditMode = kiskutya.switching;
            //console.log(this.Editdata, "editmode", this.getprojects)
            this.showModal = true
        },
        commentModalSwitch(kismacska){
            const {data} = kismacska;
            console.log(kismacska);
            this.projectData = kismacska.data
            console.log(this.projectData, "kismacsadata")
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
                    //console.log(this.projectParticipants, "rókagomba")
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
            console.log(emitData, "emitData", )
            let url='/api/send-message';
            ServiceClient.post(url, emitData).then((response) =>{
                console.log(response);
                if (response.status == 200){
                    this.show_popup=true
                    setTimeout(() => {
                        this.show_popup = false
                        this.cancelModal()
                    },  1500)
                }
            }).catch((error) => {
                this.tryAgain=null
                if (error.response && error.response.status) {
                    if (error.response.data && error.response.data.message) {
                        this.message =error.response.data.message
                        console.log(this.message, "errormessage")
                        this.show_error_popup = true
                        setTimeout(() => {
                            this.show_error_popup = false
                            this.message = "";
                            this.tryAgain=false
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
                            console.log(item, "projectBtns")
                        }
                        console.log(response.data, "RESP")
                    }
                    
                    if(this.projectButtons.employee && this.projectButtons.employee.length>0){
                        this.mergedButtons.push(this.projectButtons.employee[5])
                        this.projectButtons.employee = this.projectButtons.employee.slice(0,2)
                        //console.log("entered in the hook",this.projectButtons.employee)
                        
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
                        //console.log(this.projectButtons.manager, "MANAGER BTN")
                        this.mergedButtons.push(this.projectButtons.manager[0])
                        this.projectButtons.manager=this.projectButtons.manager.slice(2)
                        for(let item in this.projectButtons.manager){
                            this.mergedButtons.push(this.projectButtons.manager[item])
                        }
                        
                    }    
                    
                    //console.log(this.mergedButtons, "merged");
                    //console.log(this.unreadMessage, "unreadPro")
                    let foundMatch=false
                    for (let item of this.unreadMessage.Project) {
                        //console.log(Object.values(item), "unreadPro");
                        for(let i in Object.values(item)){
                            if(Object.values(item)[i] == project.project_id){
                                this.newMessage = true;
                                foundMatch=true
                                console.log("match", this.newMessage);
                                break;
                            }else{
                                this.newMessage = false;
                                console.log("match", this.newMessage);
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
            console.log(statusData, "statusData")
            let TaskId=null
            let url=`/api/get-status/${statusData.data.project_id}/${TaskId}`;

            ServiceClient.post(url).then((response) =>{
                if (response.status == 200){
                    console.log(response.data, "responseDATA")
                    for(let item in response.data){
                        this.statusDataTravel= response.data[item]
                    }
                    this.showStatusModal = true;
                    //console.log(this.statusDataTravel, "statusDataTravel", )
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
            //console.log("namizu")
        },
        SetStatus(set){
            const{data}=set
            console.log(set, "SET", this.projectData)
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
                    console.log(response.data, "responseDATA")
                    this.message = response.data.message;
                    this.getProjects();
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
                    console.log(response.data, "responseDATA")
                    for(let item in response.data){
                        this.statusDataTravel= response.data[item].status.map(u=>({id:u.id, name:u.p_status}))
                    }
                    //console.log(this.statusDataTravel, "statusDataTravel", )
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
            this.getProjects();
            //console.log(this.setFilterData, "SORTDA")

        },
        clearFilter(){
            this.setFilterData=[];
            this.getProjects();
            console.log(this.setFilterData, "SORTDA")

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
            console.log(this.setSortData, "SORTDA")
        },
        ShoudShowEnvelope(project){
            let foundMatch=false
            if(this.unreadMessage.Project !== undefined){
                for (let item of this.unreadMessage.Project) {
                    //console.log(Object.values(item), "unreadPro");
                    for(let i in Object.values(item)){
                        if(Object.values(item)[i] == project.project_id){
                            
                            foundMatch=true
                            console.log("match");
                            return foundMatch;
                        }else{
                            foundMatch=false
                            console.log("match");
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
            /*ServiceClient.post('/api/get-unread-messages').then(response => {
                console.log("getUnreadMessages",response.data);
                store.commit("getUnreadMessages", response.data);
                this.unreadMessage = response.data
            }).catch(error =>{
                console.log(error);
            });*/
        },
        favoriteStar(project){
            let dataTravel={};
            dataTravel.project= project
            console.log(dataTravel,"dataTravel")
            let url = ''
            if(project.favorite==true){
                url ='/api/remove-favorite-project';
            }else{
                url='/api/add-favorite-project';
            }   
            ServiceClient.post(url,dataTravel).then(response => {
                if(response.status === 200){
                    this.message = response.data.message
                    this.show_popup = true
                    setTimeout(() => {
                        this.show_popup = false
                        this.message = ""
                        this.getProjects()
                    },  1500)
                }
            }).catch(error =>{
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
        DataSave(kiskutya){
            const {data, str} = kiskutya
            this.dataSave = kiskutya.data;
            this.func = kiskutya.str
            console.log(kiskutya)
            this.triggerModal= true

        },
        leaveProject(){
            this.triggerModal=false;
            let dataTravel={};
            dataTravel.projectId= this.dataSave.project_id
            console.log(dataTravel,"dataTravel")
            let url = '/api/leave-project'
            
            ServiceClient.post(url,dataTravel).then(response => {
                if(response.status === 200){
                    this.message = response.data.message
                    this.show_popup = true
                    setTimeout(() => {
                        this.show_popup = false
                        this.message = ""
                        this.getProjects()
                    },  1500)
                }
            }).catch(error =>{
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
        setUserRoles(){
            this.userRole = this.$store.state.userRole
            console.log(this.userRole,"tesztRole")
        }
                
                

            
        },
        beforeMount(){
            this.setUserRoles()
        },
        mounted(){
            this.getUnreadMessages();
            this.getProjects()
            this.getUsers()
           
            
            
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
                                <button v-if="SetAddNewUser" class="ui right floated small primary labeled icon button" @click="updateModal"><i class="folder open icon"></i>Add</button></th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            
                            <!--<div class="ui segment" >
                                <div class="ui active dimmer">
                                    <div class="ui small text loader">Loading</div>
                                </div>
                                <p></p>
                            </div>-->
                        </tbody>
                        <tbody >
                            <tr v-for="project in getprojects" :key="project.id" :class="rowBackground(project)">
                                <td>{{project.project_id}}</td>
                                <td>{{project.manager}}</td>
                                <td>{{project.name}}</td>
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
                                        @showParticipantModal="this.showParticipantModal"
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
                :getusers="this.getusers" 
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
        <AreYouSureModal v-if="triggerModal==true" @trigger="triggerfunction"></AreYouSureModal>
    </div>
</template>

<style scoped>
    /*.ui.segment{
        position: absolute;
        width:100%;
        height: 100px !important;
        
    }*/
</style>
