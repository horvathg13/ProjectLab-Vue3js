<script>
  import ServiceClient from '../../ServiceClient';
  import ErrorPopup from '../Common/ErrorPopup.vue';
  

export default{
    props:{
        Participants:Array,
        projectData:null,
        taskData:null,
        
        projectId:null,
    },
    components:{
        ErrorPopup,
    },
    data(){
        return{
            NewParticipants:Array,
            InputMessage:'',
            NewData:{},
            currentUserId:null,
            messageData:Array,
            project_id:null,
            taskId:null,
            messages:Array,
            errorMessage:'',
            show_error_popup:false,
            
        }
        

    },
    created(){
        
    },
   
    methods:{
        cancelModal() {
            this.$emit("cancel-modal");
        },
        getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },

        ParticipantDataManipulation(){
            if(this.Participants.length>0){
                console.log("hello from commentmodal", this.Participants)
                this.NewParticipants = [];
                for(let parti of this.Participants){
                    this.NewParticipants.push({
                        id: parti.id,
                        name: parti.name,
                        email: parti.email,
                        color: this.getRandomColor()
                    });
                }
                console.log(this.NewParticipants)
            }
            
        },
        ArrayManipulation(){
            if(this.projectData != null){
                console.log(this.projectData,"its a project")
                this.project_id = this.projectData.project_id;
                this.NewData ={ 
                  
                    id: null, 
                    name: this.projectData.name,
                    status: this.projectData.status,
                    deadline:this.projectData.deadline,
                }
                console.log(this.NewData, "newdata")

            }else if(this.taskData != null){
                console.log(this.taskData, "this.taskData")

                    this.NewData={
                        id: this.taskData.task_id,
                        name: this.taskData.task_name,
                        status: this.taskData.status,
                        deadline: this.taskData.dedadline,
                    };

                    console.log(this.NewData, "newdata")
                
            }
           
        },
        Send(){
            this.$emit("sendEmit", {participants: this.NewParticipants, message:this.InputMessage, data:this.NewData})
        },
        getMessages(){
            if(this.projectId == null){
                this.taskId = 0;
            }else{
                this.taskId = this.taskData.task_id
                this.project_id = this.projectId
            }
            
            console.log( "parti")
            let url=`http://127.0.0.1:8000/api/get-messages/project-id/${this.project_id}/task-id/${this.taskId}/participants/${encodeURIComponent(JSON.stringify(this.NewParticipants))}`;

            ServiceClient.post(url).then((response) =>{
                    console.log(response);
                    if (response.status == 200){
                        this.messages = response.data
                        console.log( this.messages , "chat is here!")
                        this.currentUserId = this.messages.currentUser_id,
                        this.messageData = this.messages.messageData
                        console.log("query is working", this.messageData, this.currentUserId)

                        
         
                    }else{
                            console.log("I dont get data")
                        }
                }).catch((error) => {
                        
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.errorMessage = error.response.data.message
                            console.log(this.errorMessage, "errormessage")
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                                this.errorMessage = "";
                                
                            },  2000)
                            
                        }
                    }
                });


        },
        setMessageBackgroundColor(message){
           let findParticipant = this.NewParticipants.find((participant)=>participant.id === message.sender_id);
            return {
                backgroundColor: findParticipant.color
            }
        }

        
    },
    mounted(){
        console.log(this.taskData, "taskdata")
        this.ParticipantDataManipulation()
        this.ArrayManipulation()
        this.getMessages()
        //console.log("Hello from mounted", this.messages)
    }
    
}
</script>


<template>
    <div class="modal-overlay">
        <Transition name="drop">
                   <ErrorPopup v-if="show_error_popup==true" :message="this.errorMessage"></ErrorPopup>
        </Transition>
        <div class="modal participants">
            <div class="header"><h1>Participants</h1></div>
            <div class="card participants" v-for="participant in this.NewParticipants" :key="participant.id">
                
                <div class="avatar" :style="{backgroundColor: participant.color}" ><h1>{{participant.name.charAt(0).toUpperCase()}}</h1></div>
                <span>{{participant.name}}</span>

            </div>   

        </div>
            
        <div class="modal"> 
            <div class="close">
                <i class="close large red icon" @click="cancelModal"></i>
            </div>
            <div class="header" >
                
                <h1>{{ NewData.name }}</h1>
                
            </div>
                    
            <div class="messagebox">
                <div class="message content">
                    <div class="message" v-for="message in messageData" :key="message.sender_id"
                    :class="{'message': message.sender_id !== currentUserId,
                            'message response': message.sender_id === currentUserId
                            }">
                        <div class="avatar" :style="setMessageBackgroundColor(message)"><h1>{{message.sender_name.charAt(0).toUpperCase() }}</h1></div>
                        <div class="message bubble ui left pointing label"
                        :class="{'message bubble ui left pointing label': message.sender_id !== currentUserId,
                            'message bubble ui right pointing label': message.sender_id === currentUserId
                            }">
                            <div class="message bubble content">
                                <h3>{{message.message}}</h3>
                            </div>
                        </div>
                    </div>
                    
                    <!--<div class="message response"  v-for="message in messageData" :key="message.sender_id">
                        <div class="avatar response"><h1>R</h1></div>
                        <div class="message bubble ui right pointing label">
                            <div class="message bubble content">
                                <h3>Lilló</h3>
                            </div>
                        </div>
                    </div>-->
                    

                </div>
                <div class="ui large icon input">
                    <input  type="text" placeholder="Type message" v-model="InputMessage">
                    <i class="ui large paper plane outline icon" @click="Send"></i>
                    
                </div>
            </div>
            
        </div>
            
    </div>
</template>

<style scoped>
    .ui.label{
        border-color: #00000063;
    }
    span{
        color: black;
        margin-left: calc(100% - 90%);
        top: calc(100px - 95px)
    }
    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #3999fa;
        color: #fff;
        text-align: center;
        line-height: 40px;
    }
    .avatar.response{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #3999fa;
        color: #fff;
        text-align: center;
        line-height: 40px;
        left: auto;
        right: 0;
    }
    .ui.input{
        height: 40px !important;
        width: 100% !important;
        
    }
    .ui.input>input{
        border: black 1px solid;
        border-radius: 5px;
    }
    .card.participants{
        display: inline-flex;
        width: 100%;
        height: fit-content;
        border-bottom: 1px #0000004a solid;
        padding:5px
    }

    .ui.icon.input>i.icon{
        pointer-events: auto;
        cursor: pointer !important;
    }
    .messagebox{
        height:calc(100% - 25%);
        width: auto;
       
        /*overflow: auto;*/
        
    }
    .message.content{
        overflow: auto;
        height:calc(100% - 25%);
        width: 100%;
        background-color: #e6eedf7d;
        height: 100%;
        border-radius: 5px;
        display: grid;
        
    }
    .message.bubble{
        background-color: white;
        width: fit-content;
        height: fit-content;
        margin: 5px;
        padding: 5px;
        border-radius: 10px;
    }
    .message{
        display: inline-flex;
        margin:5px
    }
    .message.response{
        display: flex;
        flex-direction: row-reverse;
    }
    .header{
        margin-bottom: 0;
    }
    .ui.green.button.create{
        top:15px
    }
    .selected-text{
        color: black;
        
    }
   .ui.fluid.dropdown{
        z-index: 9999;
        
    }

    .ui.fluid.dropdown.active{
        background-color: rgb(101, 241, 101);
    }

    .modal-overlay {
    z-index: 9999;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin:auto;
    display: flex;
    justify-content: center;
    background-color: #221e1eda;
    width: 100%;
    min-height: calc(100vh - 55px);
    
    }

    .modal {
    background-color: white;
    height: calc(100% - 25%);
    width: 700px;
    margin: 15px;
    border-radius: 20px;
    padding:20px;
    min-height: calc(100% - 10%);
    }
    .modal.participants{
        min-width: 200px;
        width:250px;
        overflow: auto;
    }
    .ui.input{
        width: 500px;
        height: auto;
    }
    .form-container{
        height: 150px;
    }

    .form{
        height: 150px;
    }
    .header{
        text-align: center;
        margin-bottom:10px
    }
    .field label{
        font-weight: bold;
        color: rgb(0 0 0 / 62%) !important  
    }
    .close{
        width: 60px;
        left:84%;
        cursor: pointer;
    }

</style>

