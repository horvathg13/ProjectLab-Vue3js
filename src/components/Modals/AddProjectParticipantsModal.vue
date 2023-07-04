<script>
    import SelectComponents from '../Common/SelectComponents.vue';
    import MultipleSelectComponents from '../Common/MultipleSelectComponents.vue';
    export default{
        name: "AddProjectParticipantModal",
        components:{
           SelectComponents,
           MultipleSelectComponents,
        },
        props:{
            getusers:Array,
            projectData:Array
        },
        data(){
            return{
                selected_user:[]
                
                
            }
        },
        methods: {
            toggleDrop(){
                this.$emit("toggleDrop")
                console.log("toggleDrop is working")
            },
            cancelModal() {
                this.$emit("cancel-modal");
            },

            createParticipant(){
                this.$emit("create-participants", { selected: this.selected_user})
                
            },

            makeSelection(data) {
                const {select} = data
                this.selected_user=data
            },

          
        },
        mounted(){
           
        }
        
    }
</script>

<template>
        <div class="modal-overlay">
            
            <div class="modal"> 
                <div class="close">
                    <i class="close large red icon" @click="cancelModal"></i>
                </div>
                <div class="header">
                    
                    <h1>Add Employee To Project</h1>
                    
                </div>
                <div class="title" v-for="project in projectData" :key="project.id">
                    <h3>Selected Project: {{ project.name }}</h3>
                    <h3>Manager: {{ project.manager }}</h3>
                </div>
          
              
                <div class="forms">

                    <div class="form-container">
                        <form class="ui form" @submit.prevent="createParticipant" novalidate>
                           
                            <div class="field"><label>Employees</label></div>
                            <MultipleSelectComponents :VforArray="this.getusers.map(u=>({id:u.id, name:u.name + ' (' + u.email + ')'}))" @select="makeSelection"></MultipleSelectComponents>
                            
                    
                            <button class="ui green button create" type="submit">Create</button>
                        </form>
                    </div>
                    
              </div>
              
            </div>
            
      </div>
</template>

<style scoped>
    .title{
        top:15px
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