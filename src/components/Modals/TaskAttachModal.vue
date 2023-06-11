<script>
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    
    export default{
        name: "TaskAttachModal",
        components:{
            VueDatePicker,
        },
        props:{
            getNoParticipants:Array,
            isDropdownOpen: null,
            isDropdownOpenActive: null,
            getparticipans:Array,
            taskData:Array
        },
        data(){
            return{
                active_employee:{
                    id:[],
                    name:[],
                    email:[],
                },
                remove_active_employee:[],
                selected_employee:{
                    id: [],
                    name: [],
                    email: [],
                },
                date:""
                
            }
        },
        methods: {
            toggleDrop(){
                this.$emit("toggleDrop")
                console.log("toggleDrop is working")
            },
            toggleDropActive(){
                this.$emit("toggleDropActive")
                console.log("secound toggle drop is working")
            },
            cancelModal() {
                this.$emit("cancel-modal");
            },

            attach(){
                this.$emit("attach-user", { selected_employee: this.selected_employee, deadline: this.date,})
            },

            removeUser(){
                this.$emit("remove-user", { remove: this.remove_active_employee})
            },

            remove(user){
                remove_active_employee.push({
                    "id" : user.id,
                    "name" : user.name, 
                    "email" : user.email
                });

                this.getNoParticipants.push(user)
            },

            select_employee(user) {
                this.selected_employee.id = user.id;
                this.selected_employee.name = user.name;
                this.selected_employee.email = user.email
            },

          
        },
        mounted(){
           
        }
        
    }
</script>

<template>
        <div class="modal-overlay">
            
            <div class="modal"> 
            
                <div class="header">
                    
                    <h1>Let's Check Tasks</h1>
                    
                </div>
          
              
                <div class="forms">

                    <div class="form-container">
                        <form class="ui form" @submit.prevent="attach" novalidate>
                            <div class="field">
                                <label>{{}}</label>
                            </div>

                            <div class="field"><label>Remove Avtive Employee(s)</label></div>
                            <div class="ui fluid selection dropdown" @click="toggleDropActive" :class="{ active: remove_active_employee.name }">
                                <i class="dropdown icon"></i>
                                <input type="hidden" name="user" v-model="remove_active_employee.id">
                                    <div class="selected-text">{{ remove_active_employee.name ? remove_active_employee.name + ' (' + remove_active_employee.email + ')':"" }}</div>
                                    <div class="menu" :class="{ active: isDropdownOpen }" >
                                        <div class="item" v-for="participant in getparticipant" :key="participant.id" @click="remove(participant)">
                                            {{ participant.name }} ({{ participant.email }})
                                        </div>
                                    </div>
                            </div>

                            <div class="field"><label>Add employee(s)</label></div>
                            <div class="ui fluid selection dropdown" @click="toggleDrop" :class="{ active: selected_employee.name }">
                                <i class="dropdown icon"></i>
                                <input type="hidden" name="user" v-model="selected_employee.id">
                                    <div class="selected-text">{{ selected_employee.name ? selected_employee.name + ' (' + selected_employee.email + ')':"" }}</div>
                                    <div class="menu" :class="{ active: isDropdownOpen }" >
                                        <div class="item" v-for="user in getNoParticipants" :key="user.id" @click="select_employee(user)">
                                            {{ user.name }} ({{ user.email }})
                                        </div>
                                    </div>
                            </div>
                            <div class="field">
                                <label>Enter Deadline</label>
                                <VueDatePicker v-model="date" 
                                :flow="flow"
                                :enable-time-picker="false"
                                model-type="yyyy.MM.dd"
                                >{{ date }}</VueDatePicker>
                            </div>
                    
                            <button class="ui green button" type="submit">Create</button>
                        </form>
                    </div>
                    <div class="cancel">
                        <button class="ui red button" @click="cancelModal">Cancel</button>
                    </div>
                    
              </div>
              
            </div>
            
      </div>
</template>

<style scoped>  

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
    height: 500px;
    width: auto;
    margin: auto;
    border-radius: 20px;
    padding:30px
    }
    .ui.input{
        width: 500px;
        height: auto;
    }
    .form-container{
        height: 250px;
    }

    .form{
        margin-top: 0;
    }
    .cancel{
        margin-top: 12%;
    }
    .header{
        text-align: center;
    }
    .field label{
        font-weight: bold;
        color: rgb(0 0 0 / 62%) !important  
    }
</style>