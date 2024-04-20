<script>
import SelectComponents from '../Common/SelectComponents.vue';
import VueClickAway from 'vue3-click-away';

export default{
    props:{
        data:Array,
        task:false,
        tryAgain:false
    },
    directives:{
        VueClickAway
    },
    data(){
        return{
            SelectCompData:[],
            selectPriority:[],
            statusData:"",
            priorityData:"",
            buttonDisbale:false
        }
    },
    watch:{
        'data':{
            immediate:true,
            deep:true,
            handler(newValue){
                this.SelectCompData = newValue
                this.selectPriority = newValue.priority ? newValue.priority:null
            }
        },
        'tryAgain':{
          immediate:true,
          deep:true,
          handler(newValue){
            this.buttonDisbale=newValue
          }
        },
       
    },
    components:{
        SelectComponents,
    },
    methods:{
        
        cancelModal(){
            this.SelectCompData=null
            this.$emit("cancel-modal");
        },

        setStatus(){
            this.buttonDisbale=true,
            this.$emit("set-status",{
                                        data: this.statusData,
                                        priority:this.priorityData,

                                    })
        },

        makeSelection(selectData){
            const {select} = selectData
            this.statusData = selectData.select
        },
        makePrioritySelection(selection){
            const {select} = selection
            this.priorityData =selection.select
        }
    },
    mounted(){

    }
}
</script>

<template>
    <div class="modal-overlay">
        <div class="modal" v-click-away="cancelModal">
            <div class="close">
                <i class="close large red icon" @click="cancelModal"></i>
            </div>
            
            <div class="header">
                <i class="exclamation circle huge  icon"></i>
                
            </div>
            <form class="ui form" @submit.prevent="setStatus" novalidate>
                <div class="field upper" v-if="task == false">
                    <label>Set Status</label>
                    <select v-model="statusData" :disabled="buttonDisbale" >
                      <option value="" >Select a status</option>
                      <option v-for="status in this.SelectCompData" :value="status.id" >{{ status.p_status}}</option>
                    </select>
                </div>
                
                <div class="field upper" v-if="task == true">
                    <label>Set Status</label>
                    <select v-model="statusData" :disabled="buttonDisbale">
                      <option value="" selected>Select a status</option>
                      <option v-for="status in this.SelectCompData" :value="status.id" >{{ status.task_status}}</option>
                    </select>
                </div>
                <div class="field"  v-if="task == true">
                    <label>Set Priority</label>
                    <select v-model="priorityData" :disabled="buttonDisbale">
                      <option value="" selected>Select a priority</option>
                      <option v-for="priority in this.selectPriority" :value="priority.id" >{{ priority.name}}</option>
                    </select>
                </div>

                <div class="buttonContainer"  :class="{disabled:buttonDisbale}">
                    <button class="ui green button" type="submit" :disabled="buttonDisbale">OK</button>
                </div>
                
            </form>
            
                
                
            
                
                
                
            
            
        </div>
            
    </div>
</template>

<style scoped>
    .checkboxContainer{
        top:20px;
        display:flex
    }
    .upper{
        z-index:99999
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
    background-color: #e8da52;
    height: fit-content;
    width: 500px;
    margin: auto;
    border-radius: 20px;
    padding:20px
    }
    .ui.input{
        width: auto;
        height: auto;
        display: flex;
        margin: 0 auto
    }

    .ui.form{
        height: auto;
        
    }
    .form{
        top:0px;
        margin:0px ;
        padding:16px;
        height: 0px;
    }
    
    .header{
        text-align: center;
    }
   
    .buttonContainer{
        top:40px;
        padding:10px
    }
    
    .field label{
        font-weight: bold;
        color: rgb(0 0 0 / 62%) !important  
    }

    .close{
        width: 60px;
        left:80%;
        cursor: pointer;
    }

</style>