<script>
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    import SelectComponents from '../Common/SelectComponents.vue';
    export default{
        name: "CreateProjectModal",
        components:{
            VueDatePicker,
            SelectComponents
        },
        props:{
            getusers:Array,
            isDropdownOpen: null,
            selected:{}
            
        },
        data(){
            return{
                p_name:"",
                selectedManager:{
                    id: "",
                    name: "",
                    email: "",
                },
                date:""
                
            }
        },
        methods: {
           
            cancelModal() {
                this.$emit("cancel-modal");
            },

            createProject(){
                this.$emit("create-project", { p_name: this.p_name, manager:this.selectedManager, date: this.date})
            },


            makeSelection(data){
                const {select} = data
                this.selectedManager= select
            },
          
        },
        
    }
</script>

<template>
        <div class="modal-overlay">
            
            <div class="modal"> 
            
                <div class="header">
                    
                    <h1>Let's create a new project!</h1>
                    
                </div>
          
              
                <div class="forms">

                    <div class="form-container">
                        <form class="ui form" @submit.prevent="createProject" novalidate>
                            <div class="field">
                                <label>Project Name</label>
                                <input type="text" name="name" placeholder="Name" v-model="p_name">
                            </div>
                            <div class="field"><label>Select a Manager</label></div>
                            <SelectComponents :VforArray="this.getusers.map(u=>({id:u.id, name:u.name + ' (' + u.email + ')'}))" @select="makeSelection"></SelectComponents>
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