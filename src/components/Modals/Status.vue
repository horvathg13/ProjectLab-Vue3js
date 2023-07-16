<script>
import SelectComponents from '../Common/SelectComponents.vue';
import VueClickAway from 'vue3-click-away';

export default{
    props:{
        data:Array

    },
    directives:{
        VueClickAway
    },
    data(){
        return{
            SelectCompData:[],
            statusData:{
                id:null,
                name: "",
            },
            setAll:false,
            buttonDisbale:false
        }
    },
    watch:{
        'data':{
            immediate:true,
            deep:true,
            flush:true,
            handler(newValue){
                this.SelectCompData = newValue.status
                console.log("hello from createTask comp", this.SelectCompData)
            }
        }
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
            this.$emit("set-status", { data: this.statusData, setAll: this.setAll})
        },

        setAll() {
            this.setAll = !this.setAll         
        },

        makeSelection(data){
            const {select} = data
            this.statusData.id = data.id
            this.statusData.name = data.name
        },
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
                <h2>Set status</h2>
            </div>
            <form class="ui form" @submit.prevent="setStatus" novalidate>
                <SelectComponents
                :VforArray="this.SelectCompData.map(u=>({id:u.id, name:u.p_status}))"
                :disable="this.buttonDisbale"
                @select="makeSelection(data)"></SelectComponents>
                
                <div class="ui  toggle  checkbox" :class="{disabled:buttonDisbale}" @click="setAll">
                    <input type="checkbox" name="public" :disabled="buttonDisbale">
                    <label>Set this status to all task</label>
                </div>

                <div class="buttonContainer"  :class="{disabled:buttonDisbale}">
                    <button class="ui green button" type="submit" :disabled="buttonDisbale">Create</button>
                </div>
                
            </form>
            
                
                
            
                
                
                
            
            
        </div>
            
    </div>
</template>

<style scoped>  
    .ui.checkbox{
        top:20px;
        left:calc(100% - 80%)
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
        padding:20px;
        height: 0px;
    }
    
    .header{
        text-align: center;
    }
   
    .buttonContainer{
        top:70px;
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