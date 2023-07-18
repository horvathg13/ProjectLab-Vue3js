<script>
import SelectComponents from '../Common/SelectComponents.vue';
import VueClickAway from 'vue3-click-away';

export default{
    props:{
        data:Array,
        task:false,
    },
    directives:{
        VueClickAway
    },
    data(){
        return{
            SelectCompData:[],
            selectPriority:[],
            statusData:{},
            priorityData:{},
            setAllTask:false,
            setAllPriority:false,
            buttonDisbale:false
        }
    },
    watch:{
        'data':{
            immediate:true,
            deep:true,
            handler(newValue){
                this.SelectCompData = newValue.status
                this.selectPriority = newValue.priority ? newValue.priority:null
                console.log("hello from status comp",this.SelectCompData)
            }
        },
       
    },
    components:{
        SelectComponents,
    },
    methods:{
        
        cancelModal(){
            this.SelectCompData ={}
            this.$emit("cancel-modal");
            console.log(this.SelectCompData , "empty??");
        },

        setStatus(){
            this.buttonDisbale=true,
            this.$emit("set-status",{
                                        data: this.statusData,
                                        priority:this.priorityData,
                                        setAllTask: this.setAllTask, 
                                        setAllPriority:this.setAllPriority
                                    })
        },

        makeSelection(selectData){
            const {select} = selectData
            this.statusData = selectData.select
            console.log( this.statusData, "SELECTDATA")
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
                    <SelectComponents
                    :VforArray="this.SelectCompData.map(u=>({id:u.id, name:u.p_status}))"
                    :disable="this.buttonDisbale"
                    @select="makeSelection"></SelectComponents>
                </div>
                
                <div class="field upper" v-if="task == true">
                    <label>Set Status</label>
                    <SelectComponents
                    :VforArray="this.SelectCompData.map(u=>({id:u.id, name:u.task_status}))"
                    :disable="this.buttonDisbale"
                    @select="makeSelection"></SelectComponents>
                </div>
                <div class="field"  v-if="task == true">
                    <label>Set Priority</label>
                    <SelectComponents
                    :VforArray="this.selectPriority"
                    :disable="this.buttonDisbale"
                    @select="makePrioritySelection"></SelectComponents>
                </div>
                <div class="checkboxContainer" v-if="task == true">
                    <div class="ui  toggle  checkbox" :class="{disabled:buttonDisbale}" >
                        <input type="checkbox" name="public" :disabled="buttonDisbale" v-model="setAllTask">
                        <label>Set this status to all task</label>
                    </div>
                    <div class="ui  toggle  checkbox" :class="{disabled:buttonDisbale}" >
                        <input type="checkbox" name="public" :disabled="buttonDisbale" v-model="setAllPriority">
                        <label>Set this priority to all task</label>
                    </div>
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
    height: 400px;
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
        top:25px;
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